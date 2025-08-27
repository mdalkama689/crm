import {taskInput, taskSchema} from 'shared/src/schema/task-schema'
import { Response } from "express";
import AWS from 'aws-sdk'
import { AuthenticatedRequest } from "../middlewares/auth-middleware";
import prisma from "backend/db";
import { BUCKET_NAME, s3 } from '../app';
import { allowedAttachmentTypes } from './project-controller';

export const addTask = async (req: AuthenticatedRequest, res: Response) => {
  try {

    
    const projectId = req.params.id;
  const body: taskInput = req.body

  if(!body){
    return res.status(400).json({
      success: false,
      message: "Please provide input!"
    })
  }

  const parseResult = taskSchema.safeParse(body)
 if (!parseResult.success) {
      const validationErrors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message: validationErrors,
      });
    }

    const {dueDate} = parseResult.data

     const yearFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (dueDate?.trim()) {
      if (!yearFormatRegex.test(dueDate)) {
        return res.status(400).json({
          success: false,
          message: 'Due date format is invalid!',
        });
      }

      const currentDate = new Date();
      const dueDateInFormat = new Date(dueDate);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate > dueDateInFormat) {
        return res.status(400).json({
          success: false,
          message: 'Due date cannot be in past!',
        });
      }
    }




    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: 'Project ID is required.' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assignToEmployee: true,
      },
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to perform this action.',
      });
    }

    const loggedInUser = await prisma.employee.findUnique({
      where: { id: loggedInUserId },
    });
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to perform this action.',
      });
    }

    if (!loggedInUser.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: 'Your account is not verified.' });
    }

    if (!loggedInUser.tenantId?.trim()) {
      return res.status(403).json({
        success: false,
        message:
         'You are not associated with any tenant and cannot add tasks to this project.'

      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: loggedInUser.tenantId },
    });
    if (!tenant) {
      return res
        .status(403)
        .json({ success: false, message: 'Tenant not found.' });
    }

    if (!tenant.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: 'Tenant account is not verified.' });
    }

    if (project.tenantId !== loggedInUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add task in  this project.',
      });
    }

 
    const assingedEmployee = project.assignToEmployee

    if(assingedEmployee.length === 0 && loggedInUser.role.trim().toLowerCase() !== "admin"){
     return res.status(400).json({
  success: false,
  message: "No employees are assigned to this project, and since you are not an admin, you cannot access it."
})

    }

    if(assingedEmployee.length> 0) {
 const isAssignedEmployee = assingedEmployee.some((empl) => empl.id === loggedInUserId)

 if(!isAssignedEmployee && loggedInUser.role.trim().toLowerCase() !== "admin"){
  return res.status(403).json({
      success: false,
      message: "You are not assigned to this project, so you are not authorized to access it."
    });
  
 }
    }

    let  { name,description,attachmentUrl} = parseResult.data

    if(req.file){
      
      const attachment = req.file

      if(!attachment){
return res.status(400).json({
  success: false,
  message: "Attachment not found!"
})
      }

      if (
        attachment&&
        !allowedAttachmentTypes.includes(attachment.mimetype)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Attachment type not allowed',
        });
      }
 

      const maxSizeOFAttachmeFile = 25 * 1024 * 1024;


      if (attachment && attachment.size > maxSizeOFAttachmeFile) {
        return res.status(400).json({
          success: false,
          message: 'Attachment size cannot be more than 25 MB',
        });
      }


      const params:  AWS.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME!,
        Key: `uploads/${Date.now()}-${attachment.originalname}`,
        Body: req.file.buffer,
        ACL: "private",
        ContentType: attachment.mimetype
      }

      const attachmentResponse = await s3.upload(params).promise()
       attachmentUrl = attachmentResponse.Location


    }
    
// only edge cases i need to handle  
// if there will be ayny assigned user then i will send them notification



    const task = await prisma.task.create({
      data: {
       name,
       dueDate,
       description,
       attachmentUrl,
createdBy: loggedInUserId,
projectId,
tenantId: project.tenantId 

      }
    })

return res.status(201).json({
  success: true,
  message: "Task created successfully.",
  task
});

  } catch (error) {
const errorMessage = error instanceof Error 
  ? error.message 
  : "An unexpected error occurred while creating the task.";

console.error("Error while creating task:", error);

return res.status(500).json({
  success: false,
  message: errorMessage
});

  } 
};
 