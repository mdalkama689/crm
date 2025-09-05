import {Response} from 'express'
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import prisma from 'backend/db';
import { allowedAttachmentTypes } from './project-controller';
import { BUCKET_NAME, s3 } from '../app';
import AWS from 'aws-sdk'


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
        message: "Task id is required!"
      })
    }

    if(!projectId){
      return res.status(400).json({
        success: false,
        message: "Project id is required!"
      })
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

      const attachmentResponse = await s3.upload(params).promise();
      attachmentUrlRes = attachmentResponse.Location;
    }

    // Invalid `prisma.comment.create()`
    //  invocation in C:\Users\mdalk\crm\backend\src\controller\
    // comment-controller.ts:151:42 148 
    // attachmentUrlRes = attachmentResponse.Location; 149 } 
    // 150 → 151 const comment = await prisma.comment.
    // create( The column `projectId` does not exist in the current database.


    console.log(" task and project id ", taskId, projectId)
    const comment = await prisma.comment.create({
      data: {
        text: text ? text : "",
        attachmentUrl: attachmentUrlRes,
        creatorId: userId,
        projectId: projectId,
        taskId: taskId
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
 

export const getCommentsByProjectId =  async (req: AuthenticatedRequest, res: Response) => {
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
        projectId 
      }, 
      orderBy: {
        createdAt: "asc"
      } , 
      include: {
        employee: {
          select : {
            fullname: true 
          }
        }
      }
    })

    return res.status(200).json({
      success: true,
      message: "Fetched all comments for the specified project",
      allComments
    })

  } catch (error) {
    
    console.error("Error while fetching comments:", error);

  const errorMessage = error instanceof Error 
    ? error.message 
    : "Something went wrong while fetching comments";

  return res.status(500).json({
    success: false,
    message: errorMessage,
  });
  }

}




