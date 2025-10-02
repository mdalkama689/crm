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
    const { limit, page } = req.query;

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

    const limitNum = Number(limit);
    const offsetNum = (Number(page) - 1) * limitNum;

    const combinedFiles = await prisma.$queryRaw`
SELECT
  t.id,
  t."attachmentUrl",
  t."attachmentSize",
  t."createdAt",
  'task' AS type,
  e."fullname" AS employeeFullname,
  COALESCE(string_agg(ae."fullname", ', '), '') AS assignedEmployeeFullnames
FROM "Task" t
LEFT JOIN "Employee" e ON t."createdBy" = e.id
LEFT JOIN "_TaskAssignment" ta ON t.id = ta."B"
LEFT JOIN "Employee" ae ON ta."A" = ae.id
WHERE t."projectId" = ${projectId} AND t."attachmentUrl" != ''
GROUP BY t.id, t."attachmentUrl", t."attachmentSize", t."createdAt", e."fullname"

UNION ALL

SELECT
  c.id,
  c."attachmentUrl",
  c."attachmentSize",
  c."createdAt",
  'comment' AS type,
  e."fullname" AS employeeFullname,
  NULL AS assignedEmployeeFullnames
FROM "Comment" c
LEFT JOIN "Employee" e ON c."creatorId" = e.id
WHERE c."projectId" = ${projectId} AND c."attachmentUrl" != ''

ORDER BY "createdAt" DESC
LIMIT ${limitNum} OFFSET ${offsetNum};
`;

    return res.status(200).json({
      success: true,
      message: 'Fetch all files succcessfully!',
      allFile: combinedFiles,
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

// export const addActivi

// async function isUserVerifiedForProject(userId: string, projectId: string){
//    if (!userId) {
//       return {
//         sucecss: false,
//         message: 'Unauthenticated, please login to continue!',
//       };
//     }

//     const user = await prisma.employee.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!user || !user.tenantId) {
//       return{
//         sucecss: false,
//         message:
//           'You are not associated with any tenant. Access denied. Please contact your administrator to gain permission.',
//       }
//     }

//     const project = await prisma.project.findUnique({
//       where: {
//         id: projectId,
//         tenantId: user.tenantId,
//       },
//       include: {
//         assignToEmployee: true,
//         employee: {
//           select: {
//             fullname: true,
//           },
//         },
//       },
//     });

//     if (!project) {
//       return  {
//         success: false,
//         message: 'Project not found!',
//       }
//     }

//     let isAuthorized = false;

//     if (user.role.trim().toLowerCase() === 'admin') {
//       isAuthorized = true;
//     }
//     if (project.assignToEmployee.length > 0) {
//       const find = project.assignToEmployee.some((empl) => {
//         return empl.id === userId;
//       });

//       if (find) isAuthorized = true;
//     }

//     if (!isAuthorized) {
//       return  {
//         success: false,
//         message:
//           'You do not have permission to update or change the task attachment.',
//       }
//     }

// }
