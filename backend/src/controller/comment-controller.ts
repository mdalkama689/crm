import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import prisma from 'backend/db';
import { allowedAttachmentTypes } from './project-controller';
import { BUCKET_NAME, s3 } from '../app';
import AWS from 'aws-sdk';

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        sucecss: false,
        message: 'Unauthenticated, please login to continue!',
      });
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task id is required!',
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project id is required!',
      });
    }

    const user = await prisma.employee.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.tenantId) {
      return res.status(400).json({
        sucecss: false,
        message:
          'You are not associated with any tenant. Access denied. Please contact your administrator to gain permission.',
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        tenantId: user.tenantId,
      },
      include: {
        assignToEmployee: true,
      },
    });

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Project not found!',
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(400).json({
        success: false,
        message: 'Task not found!',
      });
    }

    let isAuthorized = false;

    if (user.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    }
    if (project.assignToEmployee.length > 0) {
      const find = project.assignToEmployee.some((empl) => {
        return empl.id === userId;
      });

      if (find) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(400).json({
        success: false,
        message:
          'You do not have permission to update or change the task attachment.',
      });
    }

    const text: string = req.body.text;

    if (!req.file && !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Atleast file or text is required for comment',
      });
    }

    let attachmentUrlRes;
    let attachmentSize;

    if (req.file) {
      const attachment = req.file;

      if (!attachment) {
        return res.status(400).json({
          success: false,
          message: 'Attachment not found!',
        });
      }

      if (attachment && !allowedAttachmentTypes.includes(attachment.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Attachment type not allowed',
        });
      }

      const maxSizeOFAttachmeFile = 25 * 1024 * 1024;
      attachmentSize = attachment.size;

      if (attachment.size > maxSizeOFAttachmeFile) {
        return res.status(400).json({
          success: false,
          message: 'Attachment size cannot be more than 25 MB',
        });
      }

      const params: AWS.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME!,
        Key: `uploads/${Date.now()}-${attachment.originalname}`,
        Body: req.file.buffer,
        ACL: 'private',
        ContentType: attachment.mimetype,
      };

      attachmentUrlRes = await s3.upload(params).promise();
    }

    const comment = await prisma.comment.create({
      data: {
        text: text ? text : '',
        attachmentUrl: attachmentUrlRes?.Location || '',
        attachmentSize: attachmentSize ? attachmentSize.toString() : '',
        creatorId: userId,
        projectId: projectId,
        taskId: taskId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    console.error('Error : ', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error while adding attachemnt';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const getCommentsByProjectId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        sucecss: false,
        message: 'Unauthenticated, please login to continue!',
      });
    }

    const projectId = req.params.projectId;

    const user = await prisma.employee.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.tenantId) {
      return res.status(400).json({
        sucecss: false,
        message:
          'You are not associated with any tenant. Access denied. Please contact your administrator to gain permission.',
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        tenantId: user.tenantId,
      },
      include: {
        assignToEmployee: true,
      },
    });

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Project not found!',
      });
    }

    let isAuthorized = false;

    if (user.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    }
    if (project.assignToEmployee.length > 0) {
      const find = project.assignToEmployee.some((empl) => {
        return empl.id === userId;
      });

      if (find) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(400).json({
        success: false,
        message:
          'You do not have permission to update or change the task attachment.',
      });
    }

    const allComments = await prisma.comment.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        employee: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Fetched all comments for the specified project',
      allComments,
    });
  } catch (error) {
    console.error('Error while fetching comments:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Something went wrong while fetching comments';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const getAllFileByProjectId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        sucecss: false,
        message: 'Unauthenticated, please login to continue!',
      });
    }

    const projectId = req.params.projectId;

    const user = await prisma.employee.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.tenantId) {
      return res.status(400).json({
        sucecss: false,
        message:
          'You are not associated with any tenant. Access denied. Please contact your administrator to gain permission.',
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        tenantId: user.tenantId,
      },
      include: {
        assignToEmployee: true,
        employee: {
          select: {
            fullname: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Project not found!',
      });
    }

    let isAuthorized = false;

    if (user.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    }
    if (project.assignToEmployee.length > 0) {
      const find = project.assignToEmployee.some((empl) => {
        return empl.id === userId;
      });

      if (find) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(400).json({
        success: false,
        message:
          'You do not have permission to update or change the task attachment.',
      });
    }

    const page = 1;
    const limit = 2;
    let allFileFromComment;

    let allFileFromTask = await prisma.task.findMany({
      where: {
        projectId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        attachmentUrl: true,
        attachmentSize: true,
        employee: {
          select: {
            fullname: true,
          },
        },
        assigedEmployees: {
          select: {
            fullname: true,
          },
        },
      },
    });

    if (allFileFromTask.length === limit) {
      console.log(' good ');
    } else {
      allFileFromComment = await prisma.comment.findMany({
        where: {
          projectId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit - allFileFromTask.length,
        select: {
          id: true,
          attachmentSize: true,
          attachmentUrl: true,
          employee: {
            select: {
              fullname: true,
            },
          },
        },
      });
    }

    const normalizedCommentFiles =
      allFileFromComment &&
      allFileFromComment.map((comment) => ({
        ...comment,
        assigedEmployees: [] as { fullname: string }[],
      }));

    let allFile = allFileFromTask;
    if (normalizedCommentFiles && normalizedCommentFiles.length > 0) {
      allFile = allFileFromTask.concat(normalizedCommentFiles);
    }

    allFile.push({
      id: project.id,
      attachmentSize: project.attachmentSize,
      attachmentUrl: project.attachmentUrl,
      employee: { fullname: project.employee.fullname },
      assigedEmployees: project.assignToEmployee,
    });

    const countOfFileFromTask = await prisma.task.count();
    const countOfFileFromComment = await prisma.comment.count();
    const countOfFileFromProject = project.attachmentUrl ? 1 : 0;

    const totalAttachmentCount =
      countOfFileFromTask + countOfFileFromComment + countOfFileFromProject;

    return res.status(200).json({
      success: true,
      message: 'Fetch all files succcessfully!',
      allFile,
      count: totalAttachmentCount,
    });
  } catch (error) {
    console.error('Error while fetching files :', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Something went wrong while fetching files';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
