import AWS from 'aws-sdk';
import prisma from 'backend/db';
import type { Response } from 'express';
import { createProjectSchema } from 'shared/src/schema/create-project-schema';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { generateNotificationForProject } from '../utils/generateNotification';
import { BUCKET_NAME, s3 } from '../app';
import { validateDueDate } from '../utils/validateDueDate'; 

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// add auth and admin middleware

export const allowedAttachmentTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const body = req.body;

    console.log(body);

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs!',
      });
    }

    const parseResult = createProjectSchema.safeParse(body);
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

    let iconUrl = '';
    let attachmentUrl = '';

    let { name, description, dueDate, assignToEmployee } = parseResult.data;

    if (req.files) {
      const files = req.files as
        | { [fieldname: string]: MulterFile[] }
        | undefined;

      const iconFile = files?.['icon']?.[0];
      const attachmentFile = files?.['attachment']?.[0];

      const allowedIconTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
      ];

      if (iconFile && !allowedIconTypes.includes(iconFile.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Icon must be a valid image (png, jpeg, jpg, svg)',
        });
      }

      if (
        attachmentFile &&
        !allowedAttachmentTypes.includes(attachmentFile.mimetype)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Attachment type not allowed',
        });
      }

      const maxSizeOFIconFile = 5 * 1024 * 1024;
      const maxSizeOFAttachmeFile = 25 * 1024 * 1024;

      if (iconFile && iconFile.size > maxSizeOFIconFile) {
        return res.status(400).json({
          success: false,
          message: 'Icon size cannot be more than 5 MB',
        });
      }

      if (attachmentFile && attachmentFile.size > maxSizeOFAttachmeFile) {
        return res.status(400).json({
          success: false,
          message: 'Attachment size cannot be more than 25 MB',
        });
      }

      if (iconFile) {
        const params: AWS.S3.PutObjectRequest = {
          Bucket: BUCKET_NAME!,
          Key: `uploads/${Date.now()}-${iconFile.originalname}`,
          Body: iconFile.buffer,
          ACL: 'private',
          ContentType: iconFile.mimetype,
        };
        const iconReponse = await s3.upload(params).promise();
        iconUrl = iconReponse.Location;
      }

      if (attachmentFile) {
        const params: AWS.S3.PutObjectRequest = {
          Bucket: BUCKET_NAME!,
          Key: `uploads/${Date.now()}-${attachmentFile.originalname}`,
          Body: attachmentFile.buffer,
          ACL: 'private',
          ContentType: attachmentFile.mimetype,
        };

        const attchmentReponse = await s3.upload(params).promise();
        attachmentUrl = attchmentReponse.Location;
      }
    }

   
     
         if (dueDate?.trim()) {
            const isvalidDueDate = validateDueDate(dueDate)
     
            if(!isvalidDueDate.success){
             return res.status(400).json({
               success: false,
               message: isvalidDueDate.message 
              })
            }
         } 
    

    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in to continue.',
      });
    }

    const currentUser = await prisma.employee.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!currentUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'User is not verified. Please verify your account first.',
      });
    }

    const tenantId = currentUser.tenantId;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID does not exist for the current user.',
      });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found.',
      });
    }

    if (!tenant.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          'Tenant is not verified. Verified tenants are required to create projects.',
      });
    }

    const uniqueEmployeeIds = new Set();

    if (typeof assignToEmployee === 'string') {
      const employeeIds = JSON.parse(assignToEmployee);

      for (let i = 0; i < employeeIds.length; i++) {
        if (uniqueEmployeeIds.has(employeeIds[i])) {
          const duplicateEmployee = await prisma.employee.findUnique({
            where: { id: employeeIds[i] },
          });

          if (!duplicateEmployee) {
            return res.status(400).json({
              success: false,
              message: `${employeeIds[i]} employee does not exist`,
            });
          }

          return res.status(400).json({
            success: false,
            message: `Duplicate assignment detected: Employee ${duplicateEmployee?.fullname.charAt(0).toUpperCase() + duplicateEmployee?.fullname?.slice(1, duplicateEmployee.fullname.length)} (ID: ${duplicateEmployee?.id}) is assigned more than once. Please ensure each employee is assigned only once.`,
          });
        } else {
          uniqueEmployeeIds.add(employeeIds[i]);
        }
      }

      if (employeeIds.length > 0) {
        const verifiedEmployees = await prisma.employee.findMany({
          where: {
            id: { in: employeeIds },
            isVerified: true,
            tenantId,
          },
        });

        if (verifiedEmployees.length !== employeeIds.length) {
          return res.status(400).json({
            success: false,
            message:
              'Some employees are either not verified or do not belong to this tenant. Please provide only valid employees.',
          });
        }
      }
    }

    const employeeIdsInArray = [...new Set(uniqueEmployeeIds)] as string[];

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        dueDate,
        attachmentUrl,
        iconUrl,
        tenantId,
        createdBy: currentUserId,
        assignToEmployee:
          employeeIdsInArray && employeeIdsInArray.length > 0
            ? { connect: employeeIdsInArray.map((id) => ({ id })) }
            : undefined,
      },
      include: {
        assignToEmployee: true,
      },
    });

    const notification = generateNotificationForProject({
      adminName: currentUser.fullname,
      projectName: name,
    });

    for (let i = 0; i < employeeIdsInArray.length; i++) {
      await prisma.notification.create({
        data: {
          text: notification,
          enitityId: newProject.id,
          entityType: 'PROJECT',
          employeeId: employeeIdsInArray[i],
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      projectId: newProject.id,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unexpected error occurred.';

    console.error('Error while creating project:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// add auth and admin middleware
export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: 'Project ID is required.' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
          'You are not associated with any tenant and cannot delete this project.',
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
        message: 'You are not authorized to delete this project.',
      });
    }

    if (project.iconUrl) {
      const iconKey = project.iconUrl.split('.com/')[1];
      const response = await s3
        .deleteObject({
          Bucket: BUCKET_NAME!,
          Key: iconKey,
        })
        .promise();
      console.log(' reposne l : ', response);
    }
    if (project.attachmentUrl) {
      const attachmentKey = project.attachmentUrl.split('.com/')[1];
      await s3
        .deleteObject({
          Bucket: BUCKET_NAME!,
          Key: attachmentKey,
        })
        .promise();
    }

    await prisma.project.delete({ where: { id: projectId } });

    return res
      .status(200)
      .json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Error deleting project:', errorMessage);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${errorMessage}`,
    });
  }
};

// add auth and admin middleware

// who can get the project details:-
// any admin
// and assigned user

export const getProjectForAdminAndAssignee = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: 'Project ID is required.' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        assignToEmployee: {
          select: {
            id: true,
            fullname: true,
          },
        },
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
          'You are not associated with any tenant and cannot access this project.',
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
        message: 'You are not authorized to view this project.',
      });
    }

    const assignedEmployee = project.assignToEmployee;

    if (assignedEmployee.length === 0 && loggedInUser.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message:
          'No employee is assigned to this project, and you are not an admin, so you cannot view it.',
      });
    }

    if (assignedEmployee.length > 0) {
      const isAssignedEmployee = assignedEmployee.some(
        (emp) => emp.id === loggedInUserId,
      );

      if (!isAssignedEmployee) {
        return res.status(400).json({
          success: false,
          message:
            'You are not assigned to this project or an admin, so you are not authorized to access it.',
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Project fetched successfully.',
      project,
      assignedEmployee,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Error fetching project:', errorMessage);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${errorMessage}`,
    });
  }
};

// add auth and admin middleware

export const getAdminCreatedProjects = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
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
          'You are not associated with any tenant and cannot delete this project.',
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

    const allProjectsCreatedByYou = await prisma.project.findMany({
      where: {
        createdBy: loggedInUserId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'All projects created by you have been fetched successfully.',
      projects: allProjectsCreatedByYou,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Error deleting project:', errorMessage);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${errorMessage}`,
    });
  }
};

// get all project of my company/tenant

// add auth and admin middleware
export const getAllProjectsOfCompany = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
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
          'You are not associated with any tenant and cannot access projects.',
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

    const allProjectsOfCompany = await prisma.project.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        assignToEmployee: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully.',
      projects: allProjectsOfCompany,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Error fetching company projects:', errorMessage);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${errorMessage}`,
    });
  }
};




export const getAssignedEmployeesForProject   =  async (req: AuthenticatedRequest, res: Response) => {

  try {
    
const loggedInUserId = req.user?.id
const projectId = req.params.id 

if(!loggedInUserId){
  return res.status(400).json({
    success: false,
    message: "Unauthenticated, Please logged in continue "
  })
}

const loggedInUser = await prisma.employee.findUnique({
  where :  {
id: loggedInUserId
  }
})

if(!loggedInUser){
  return res.status(400).json({
    success: false,
    message: "Unauthenticated, Please logged in continue "
  })
}


if(!projectId){
  return res.status(400).json({
    success: false,
    message: "Projetc id not found !"
  })
}


const project = await prisma.project.findUnique({
  where: {
    id:projectId
  },
  include: {
    assignToEmployee: true 
  }
})

if(!project){
  return res.status(400).json({
    success: false,
    message: "Projetc not found !"
  })
}

if(loggedInUser.tenantId !== project.tenantId){
 return res.status(403).json({
        success: false,
        message: "You do not belong to the same tenant as this project."
      });

}

const assignedEmployees   = project.assignToEmployee

const isAssigned = assignedEmployees.some((empl) => empl.id === loggedInUserId)
const isAdmin = loggedInUser.role.trim().toLowerCase() !== "admin" 

  if (!isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this project and do not have admin access."
      });
    }

return res.status(200).json({
 success: true,
      message: "Assigned employees fetched successfully.",
      employees: assignedEmployees 
})


  } catch (error) {
        console.error("Error fetching assigned employees:", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while fetching assigned employees."

  return res.status(400).json({
    success: false,
    message : errorMessage
  })
  }


}