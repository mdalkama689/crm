// // import {Request, Response} from 'express'
// // import AWS from 'aws-sdk'
// // import fs from 'fs'
// // import multer from 'multer'
// // // import prisma from 'backend/db'
// // // import googleLogo from '../assets/google.png'

// // // get project input
// // // validate that
// // // store value in digital ocean
// // // and in db
// // // notify to all the employee(if)

// //      const storage  =    multer.diskStorage({
// //             destination: (_, __,  cb) => {
// //                 cb(null, "")
// //             },
// //             filename: (_, file,  cb) => {
// //                     cb(null, Date.now() + " -" + file.originalname);
// //             }
// //         })

// //      export const upload =   multer({storage})

// // export const createProject =  async (req:Request, res: Response) => {
// //     try {
// //  const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
// //     const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY
// //     const ENDPOINT_URL = process.env.ENDPOINT_URL
// //     const BUCKET_NAME =  process.env.BUCKET_NAME

// //     const spacesEndpoint = new AWS.Endpoint(ENDPOINT_URL!)

// //     const s3 = new AWS.S3({
// //         endpoint: spacesEndpoint,
// //         accessKeyId: ACCESS_KEY_ID,
// //         secretAccessKey: SECRET_ACCESS_KEY
// //     })

// //    const file = fs.readFileSync('../assets/google.png')

// //     await s3.listObjectsV2({Bucket: BUCKET_NAME!, MaxKeys: 5}).promise()
// //  s3.putObject({Bucket:BUCKET_NAME!, Key: "any_file_or_path_name.jpg", Body: file, ACL: "public"}, (err, data) => {
// // if (err) return console.log(err);
// // console.log("Your file has been uploaded successfully!", data);
// // });

// //     return res.status(200).json({
// //       success: true,
// //       message: 'Connection to DigitalOcean Spaces verified!',
// //  file
// //     });

// //     } catch (error) {

// //     return res.status(200).json({
// //             success: true,
// //             message:  error
// //         })
// //     }
// // }

// import { Request, Response } from 'express';
// import AWS from 'aws-sdk';
// import fs from 'fs';

// export const createProject = async (_: Request, res: Response) => {
//   try {
//     const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
//     const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
//     const ENDPOINT_URL = process.env.ENDPOINT_URL;
//     const BUCKET_NAME = process.env.BUCKET_NAME;

//     const spacesEndpoint = new AWS.Endpoint(ENDPOINT_URL!);

//     const s3 = new AWS.S3({
//       endpoint: spacesEndpoint,
//       accessKeyId: ACCESS_KEY_ID,
//       secretAccessKey: SECRET_ACCESS_KEY,
//     });

//     // Local file read
//     const file = fs.readFileSync('../assets/google.png');

//     // Unique file name
//     const fileName = `uploads/google-${Date.now()}.png`;

//     // Upload file and wait for completion
//     const uploadResult = await s3
//       .putObject({
//         Bucket: BUCKET_NAME!,
//         Key: fileName,
//         Body: file,
//         ACL: 'public-read', // make file publicly accessible
//       })
//       .promise();

//     console.log('Upload success:', uploadResult);

//     return res.status(200).json({
//       success: true,
//       message: 'File uploaded successfully to DigitalOcean Spaces!',
//       result: uploadResult, // contains ETag
//       fileUrl: `${ENDPOINT_URL}/${BUCKET_NAME}/${fileName}`,
//     });
//   } catch (error) {
//     console.error('Upload failed:', error);
//     return res.status(500).json({
//       success: false,
//       message: error,
//     });
//   }
// };

//  const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
//     const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY
//     const ENDPOINT_URL = process.env.ENDPOINT_URL
//     const BUCKET_NAME =  process.env.BUCKET_NAME

//     const spacesEndpoint = new AWS.Endpoint(ENDPOINT_URL!)

//     const s3 = new AWS.S3({
//         endpoint: spacesEndpoint,
//         accessKeyId: ACCESS_KEY_ID,
//         secretAccessKey: SECRET_ACCESS_KEY
//     })

//     await s3.listObjectsV2({Bucket: BUCKET_NAME!, MaxKeys: 5}).promise()


import prisma from "backend/db";
import {Response }  from "express"
import {
createProjectInput, createProjectSchema
} from 'shared/src/schema/create-project-schema';
import { AuthenticatedRequest } from "../middlewares/auth-middleware";


export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestBody: createProjectInput = req.body;

    if (!requestBody) {
      return res.status(400).json({
        success: false,
        message: "Please provide inputs!",
      });
    }

   
    const parseResult = createProjectSchema.safeParse(requestBody);
    if (!parseResult.success) {
      const validationErrors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message:  validationErrors 
      });
    }

    const { name, icon, description, dueDate, attachment, assignToEmployee } =
      parseResult.data;

    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in to continue.",
      });
    }

 
    const currentUser = await prisma.employee.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!currentUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "User is not verified. Please verify your account first.",
      });
    }

    const tenantId = currentUser.tenantId;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID does not exist for the current user.",
      });
    }
 
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found.",
      });
    }

    if (!tenant.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Tenant is not verified. Verified tenants are required to create projects.",
      });
    }

 
    if (assignToEmployee.length > 0) {
      const verifiedEmployees = await prisma.employee.findMany({
        where: {
          id: { in: assignToEmployee },
          isVerified: true,
          tenantId,
        },
      });

      if (verifiedEmployees.length !== assignToEmployee.length) {
        return res.status(400).json({
          success: false,
          message:
            "Some employees are either not verified or do not belong to this tenant. Please provide only valid employees.",
        });
      }
    }


    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        dueDate,
        attachment,
        icon,
        tenantId,
        createdBy: currentUserId,
        assignToEmployee:
          assignToEmployee.length > 0
            ? { connect: assignToEmployee.map((id) => ({ id })) }
            : undefined,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: newProject,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred.";

    console.error("Error while creating project:", errorMessage);

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
      error: errorMessage,
    });
  }
};

