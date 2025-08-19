import { Request, Response } from 'express';
import { TenantInput, tenantSchema } from 'shared/src/schema/tenant-schema';
import { SignUpInput, signUpSchema } from 'shared/src/schema/sign-up-schema';
import prisma from '../../db';
import argon2 from 'argon2';
import { checkEmailFormatValid } from '../utils/checkEmailFormatValid';

export const signUp = async (req: Request, res: Response) => {
  try {
    const body: SignUpInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs.',
      });
    }

    const parseResult = signUpSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { email, fullname, password } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const hashedPassword = await argon2.hash(password);

    if (!user) {
      await prisma.employee.create({
        data: {
          email,
          fullname,
          password: hashedPassword,
          tenantId: null,
        },
      });
    } else {
      await prisma.employee.update({
        where: { email },
        data: {
          email,
          fullname,
          password: hashedPassword,
          tenantId: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Account created successfully! Please create your company to continue.',
    });
  } catch (error) {
    console.error('Unexpected error during employee registration:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unexpected error during employee registration:';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    const body: TenantInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs.',
      });
    }

    const parseResult = tenantSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { name, address, businessType, employeeRange } = parseResult.data;

    const tenant = await prisma.tenant.findUnique({
      where: {
        normalizedName: name.toLowerCase().replace(/\s+/g, ''),
      },
    });

    if (tenant) {
      return res.status(400).json({
        success: false,
        message: 'Company already registered!',
      });
    }

    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to create a company.!',
      });
    }

    const validateEmail = checkEmailFormatValid(email);

    if (!validateEmail) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format!',
      });
    }

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const tenantId = user.tenantId;

    if (tenantId) {
      return res.status(400).json({
        success: false,
        message: 'You have already created a company.',
      });
    }

    const newTenant = await prisma.tenant.create({
      data: {
        name,
        normalizedName: name.toLowerCase().replace(/\s+/g, ''),
        isVerified: false,
        employeeRange,
        businessType,
        address,
      },
    });

    await prisma.employee.update({
      where: { id: user.id },
      data: { tenantId: newTenant.id, isVerified: true, role: 'admin' },
    });

    return res.status(200).json({
      success: true,
      message: 'Company registered successfully!',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unexpected error during tenant registration:';
    console.error('Unexpected error during tenant registration:', error);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
