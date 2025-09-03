import { taskInput, taskSchema } from 'shared/src/schema/task-schema';
import { Response } from 'express';
import AWS from 'aws-sdk';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import prisma from 'backend/db';
import { BUCKET_NAME, s3 } from '../app';
import { allowedAttachmentTypes } from './project-controller';
import {
  generateNotificationForAddTask,
  generateNotificationForTask,
} from '../utils/generateNotification';
import { validateDueDate } from '../utils/validateDueDate';

export const addTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const body: taskInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide input!',
      });
    }

    const parseResult = taskSchema.safeParse(body);
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

    const { dueDate, assignedEmployee, name, description } = parseResult.data;

    if (dueDate?.trim()) {
      const isvalidDueDate = validateDueDate(dueDate);

      if (!isvalidDueDate.success) {
        return res.status(400).json({
          success: false,
          message: isvalidDueDate.message,
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
          'You are not associated with any tenant and cannot add tasks to this project.',
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

    const assingedToEmployee = project.assignToEmployee;

    if (
      assingedToEmployee.length === 0 &&
      loggedInUser.role.trim().toLowerCase() !== 'admin'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'No employees are assigned to this project, and since you are not an admin, you cannot access it.',
      });
    }

    if (assingedToEmployee.length > 0) {
      const isAssignedEmployee = assingedToEmployee.some(
        (empl) => empl.id === loggedInUserId,
      );

      if (
        !isAssignedEmployee &&
        loggedInUser.role.trim().toLowerCase() !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message:
            'You are not assigned to this project, so you are not authorized to access it.',
        });
      }
    }

    let attachmentUrl = '';

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

      if (attachment && attachment.size > maxSizeOFAttachmeFile) {
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
      attachmentUrl = attachmentResponse.Location;
    }

    const uniqueEmployeeIds = new Set<string>();

    if (typeof assignedEmployee === 'string') {
      const employeeIds = JSON.parse(assignedEmployee);

      for (let i = 0; i < employeeIds.length; i++) {
        if (uniqueEmployeeIds.has(employeeIds[i])) {
          return res.status(400).json({
            success: false,
            message: `Please dont add duplicate id that is ${employeeIds[i]}`,
          });
        } else {
          uniqueEmployeeIds.add(employeeIds[i]);
        }
      }

      const employeeIdsInArray = [...new Set(uniqueEmployeeIds)] as string[];

      const assingedToEmployeeIds = assingedToEmployee
        .filter((empl) => empl.id !== undefined)
        .map((em) => em.id);
      const assingedToEmployeeIdsInSet = new Set(assingedToEmployeeIds);

      for (let i = 0; i < employeeIdsInArray.length; i++) {
        if (!assingedToEmployeeIdsInSet.has(employeeIdsInArray[i])) {
          const existingEmployee = await prisma.employee.findUnique({
            where: { id: employeeIdsInArray[i] },
          });

          if (!existingEmployee) {
            return res.status(400).json({
              success: false,
              message: `The selected employee account could not be found (ID: ${employeeIdsInArray[i]}).`,
            });
          }

          return res.status(400).json({
            success: false,
            message: `Employee ${existingEmployee.fullname} is not associated with this project.`,
          });
        }
      }
    }

    //  assignToEmployee:
    //     employeeIdsInArray && employeeIdsInArray.length > 0
    //       ? { connect: employeeIdsInArray.map((id) => ({ id })) }
    //       : undefined,

    const task = await prisma.task.create({
      data: {
        name,
        dueDate,
        description,
        attachmentUrl,
        createdBy: loggedInUserId,
        projectId,
        tenantId: project.tenantId,
        assigedEmployees:
          uniqueEmployeeIds.size > 0
            ? {
                connect: Array.from(uniqueEmployeeIds).map((id) => ({ id })),
              }
            : undefined,
      },
    });

    const notificationForTaskAssinged = generateNotificationForTask({
      taskCreatorName: loggedInUser.fullname,
      taskName: task.name,
    });

    if (uniqueEmployeeIds.size > 0) {
      for (const id of uniqueEmployeeIds) {
        if (id !== loggedInUserId) {
          await prisma.notification.create({
            data: {
              text: notificationForTaskAssinged,
              enitityId: task.id,
              entityType: 'TASK',
              employeeId: id,
            },
          });
        }
      }
    }

    const notificationForTaskCreated = generateNotificationForAddTask({
      taskCreatorName: loggedInUser.fullname,
      taskName: task.name,
    });

    const assignedEmployees = project.assignToEmployee;

    for (const employee of assignedEmployees) {
      const employeeId = employee.id;
      if (!uniqueEmployeeIds.has(employeeId)) {
        await prisma.notification.create({
          data: {
            text: notificationForTaskCreated,
            enitityId: task.id,
            entityType: 'TASK',
            employeeId: employeeId,
          },
        });
      }
    }

    const projectCreatorId = project.createdBy;

    if (projectCreatorId !== loggedInUserId) {
      await prisma.notification.create({
        data: {
          text: notificationForTaskCreated,
          enitityId: task.id,
          entityType: 'TASK',
          employeeId: projectCreatorId,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while creating the task.';

    console.error('Error while creating task:', error);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const fetchAllProjectTasks = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not found in request',
      });
    }

    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project id is required!',
      });
    }

    const loggedInUser = await prisma.employee.findUnique({
      where: { id: loggedInUserId },
    });
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user does not exist',
      });
    }

    if (!loggedInUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: tenant id missing for logged in user',
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tenantId: loggedInUser.tenantId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access',
      });
    }

    let isAuthorized = false;

    if (loggedInUser.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    } else {
      const isAssigned = await prisma.project.findFirst({
        where: {
          id: projectId,
          assignToEmployee: { some: { id: loggedInUserId } },
        },
      });
      isAuthorized = !!isAssigned;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: you are not authorized to access tasks of this project',
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        tasks.length > 0
          ? 'Successfully fetched all assigned tasks'
          : 'No tasks found for this project',
      tasks,
    });
  } catch (error) {
    console.error('Error : ', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unexpected error occurred';
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const addTaskItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const projectId = req.params.projectId;
    const { taskItemName }: { taskItemName: string } = req.body;

    if (!taskItemName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please add  task item!',
      });
    }

    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not found in request',
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project id is required!',
      });
    }

    const loggedInUser = await prisma.employee.findUnique({
      where: { id: loggedInUserId },
    });
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user does not exist',
      });
    }

    if (!loggedInUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: tenant id missing for logged in user',
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tenantId: loggedInUser.tenantId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access',
      });
    }

    let isAuthorized = false;

    if (loggedInUser.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    } else {
      const isAssigned = await prisma.project.findFirst({
        where: {
          id: projectId,
          assignToEmployee: { some: { id: loggedInUserId } },
        },
      });
      isAuthorized = !!isAssigned;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: you are not authorized to access tasks of this project',
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

    const taskItem = await prisma.taskItem.create({
      data: {
        name: taskItemName,
        taskId: task.id,
        completed: false,
      },
    });

    await prisma.task.findUnique({
      where: { id: taskId },
      include: { taskItems: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Task item added successfully!',
      taskItem,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error during while  ading a new task item!';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const fetchAllTaskItem = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const taskId = req.params.taskId;
    const projectId = req.params.projectId;

    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not found in request',
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project id is required!',
      });
    }

    const loggedInUser = await prisma.employee.findUnique({
      where: { id: loggedInUserId },
    });
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user does not exist',
      });
    }

    if (!loggedInUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: tenant id missing for logged in user',
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tenantId: loggedInUser.tenantId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access',
      });
    }

    let isAuthorized = false;

    if (loggedInUser.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    } else {
      const isAssigned = await prisma.project.findFirst({
        where: {
          id: projectId,
          assignToEmployee: { some: { id: loggedInUserId } },
        },
      });
      isAuthorized = !!isAssigned;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: you are not authorized to access tasks of this project',
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskItems: true,
        assigedEmployees: true,
      },
    });

    if (!task) {
      return res.status(400).json({
        success: false,
        message: 'Task not found!',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Task items fetch successfully!',
      task,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error during while  fetching task item!';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};


export const toggleTaskItemCompletion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    

const projectId = req.params.projectId 
const taskId = req.params.taskId 
const taskItemId = req.params.taskItemId  

console.log(" project id , task id and task item id ", projectId, taskId, taskItemId)

const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not found in request',
      });
    }

  


    const loggedInUser = await prisma.employee.findUnique({
      where: { id: loggedInUserId },
    });
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user does not exist',
      });
    }

    if (!loggedInUser.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: tenant id missing for logged in user',
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tenantId: loggedInUser.tenantId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access',
      });
    }
    const task = await prisma.task.findUnique({
      where: {
        id:  taskId
      },
      include: {
        taskItems: true
      }
    })

        if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

 
  const taskItem = await prisma.taskItem.findUnique({
    where: {id: taskItemId}
  })


  if(!taskItem){
return res.status(400).json({
  success: false,
  message:  "Task item not found"
})
  }

 



    let isAuthorized = false;

    if (loggedInUser.role.trim().toLowerCase() === 'admin') {
      isAuthorized = true;
    } else {
      const isAssigned = await prisma.project.findFirst({
        where: {
          id: projectId,
          assignToEmployee: { some: { id: loggedInUserId } },
        },
      });
      isAuthorized = !!isAssigned;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: you are not authorized to access tasks of this project',
      });
    }

   const updatedTaskItem =   await prisma.taskItem.update({
    where: {id: taskItemId},
    data: {
      completed: taskItem.completed ? false: true
    }
  })



  return res.status(200).json({
    success: true,
      message: `Task item marked as ${updatedTaskItem.completed ? 'complete' : 'incomplete'} successfully!`,
  })
  } catch (error) {
     console.error("Error while toggling task item completion:", error);
    const errorMessage = error instanceof Error ? error.message : "Error while toggling task item";
    return res.status(500).json({ success: false, message: errorMessage }); 
  }
}