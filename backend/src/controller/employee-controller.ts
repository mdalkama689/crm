import { Request, Response } from 'express';
import {
  SignInInputUser,
  signInSchema,
} from 'shared/src/schema/sign-in-schema';
import {
  employeeSignUpInput,
  employeeSignUpSchema,
} from 'shared/src/schema/employee-sign-up-schema';
import {
  VerifyOtpInput,
  verifyOtpSchema,
} from 'shared/src/schema/verify-otp-schema';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from 'shared/src/schema/reset-password-schema';
import {
  ChangeRoleInput,
  changeRoleSchema,
} from 'shared/src/schema/change-role-schema';
import prisma from '../../db';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { checkEmailFormatValid } from '../utils/checkEmailFormatValid';
import { v4 } from 'uuid';
import { sendEmailForInvitation, sendEmailForOtp } from '../utils/sendEmail';
import { generateOtp } from '../utils/generateOtp';
import crypto from 'crypto';
import gravatar from 'gravatar';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';

// no middleware
export const signIn = async (req: Request, res: Response) => {
  try {
    const body: SignInInputUser = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const parseResult = signInSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message: errorMessage,
      });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.employee.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    if (user && !user.isVerified) {
      return res.status(404).json({
        success: false,
        message:
          'Your account exists but is not verified yet. Please verify your email to continue.',
      });
    }

    if (user.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: {
          id: user.tenantId,
        },
      });

      if (!tenant?.isVerified) {
        return res.status(404).json({
          success: false,
          message:
            'Your tenant account exists but has not been verified yet. Please verify it to continue.',
        });
      }
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
    if (!JWT_TOKEN_SECRET) {
      console.error('JWT_TOKEN_SECRET is not set in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please try again later.',
      });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    };

    const token = jwt.sign(payload, JWT_TOKEN_SECRET, { expiresIn: '90d' });

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unexpected error during sign-in';
    console.error('Unexpected error during sign-in:', error);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// auth and admin middleware

export const sendInvitation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const body = req.body;

    console.log(' body : ', body);
    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the required input.',
      });
    }

    const email: string = body.email;
    const tenantId: string = body.tenantId;
    const isValidEmail = checkEmailFormatValid(email);

    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: 'The provided email format is invalid.',
      });
    }

    if (!tenantId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required to send an invitation.',
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'The specified company does not exist.',
      });
    }

    if (!tenant.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          'Your company account is not verified. Cannot send invitations yet.',
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (employee && employee.isVerified) {
      return res.status(200).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    const loggedInUser = await prisma.employee.findUnique({
      where: {
        id: req.user?.id,
      },
    });

    if (tenantId !== loggedInUser?.tenantId) {
      return res.status(400).json({
        success: false,
        message: 'You are not authorized to access this tenant.',
      });
    }

    const token = v4();
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const url = `${FRONTEND_URL}/invite?email=${email}&token=${token}&tenantId=${tenantId}`;

    const responseSendEmail = await sendEmailForInvitation(email, url);

    if (!responseSendEmail) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send the invitation email. Please try again later.',
      });
    }

    const hashedToken = await argon2.hash(token);
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);

    const employeeExist = await prisma.employee.findUnique({
      where: { email },
    });

    if (employeeExist) {
      await prisma.employee.update({
        where: { email },
        data: {
          invitationLink: hashedToken,
          invitationLinkExpireTime: date,
          tenantId,
        },
      });
    } else {
      await prisma.employee.create({
        data: {
          fullname: '',
          email,
          password: '',
          role: 'employee',
          invitationLink: hashedToken,
          invitationLinkExpireTime: date,
          isVerified: false,
          tenantId,
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: `An invitation has been successfully sent to ${email}. The link will expire in 10 minutes.`,
      url,
      tenant,
    });
  } catch (error) {
    console.error('Error sending invitation: ', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while sending the invitation. Please try again later';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// no middleware

export const validateTokenAndSignUp = async (req: Request, res: Response) => {
  try {
    const body: employeeSignUpInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide input!',
      });
    }

    const parseResult = employeeSignUpSchema.safeParse(body);
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

    const { fullname, password, email, token, tenantId } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for this email.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account is already exist.',
      });
    }

    if (!user.invitationLink || !user.invitationLinkExpireTime) {
      return res.status(400).json({
        success: false,
        message: 'No valid invitation found. Please request a new invitation.',
      });
    }

    const isValidToken = await argon2.verify(user.invitationLink, token);
    const isTokenNotExpired = user.invitationLinkExpireTime > new Date();

    if (!isValidToken || !isTokenNotExpired) {
      return res.status(400).json({
        success: false,
        message: 'Invitation link is invalid or has expired.',
      });
    }

    if (user.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Email mismatch. Please use the email from the invitation.',
      });
    }

    if (!tenantId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide tenant id',
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    console.log(' body : ', req.body);
    console.log(' tenand ', tenant);
    if (!tenant) {
      return res.status(400).json({
        success: false,
        message: 'This specific tenant does not exist.',
      });
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.employee.update({
      where: { email },
      data: {
        fullname,
        password: hashedPassword,
        invitationLink: '',
        invitationLinkExpireTime: null,
        isVerified: true,
        tenantId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Account verified and created successfully.',
    });
  } catch (error) {
    console.error('Unexpected error during employee signup:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unexpected error during employee signup';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// no middleware

export const logout = (_: Request, res: Response) => {
  try {
    res.clearCookie('token');

    return res.status(200).json({
      success: true,
      message: 'You have been logged out successfully.',
    });
  } catch (error) {
    console.error('Error during logout:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to log out at the moment. Please try again later.',
    });
  }
};

// auth middleware

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to subscribe.',
      });
    }

    const isValidEmail = checkEmailFormatValid(email);

    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: 'The provided email is not valid.',
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'No employee found with the provided email.',
      });
    }

    if (employee && employee.isNewLetterSubscribed) {
      return res.status(400).json({
        success: false,
        message: 'You already have subscribed to the newsletter.',
      });
    }

    await prisma.employee.update({
      where: { email },
      data: { isNewLetterSubscribed: true },
    });

    return res.status(200).json({
      success: true,
      message: 'You have successfully subscribed to the newsletter.',
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unexpected error occurred while subscribing to the newsletter. Please try again later.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// no need to add auth
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.',
      });
    }

    const isValidEmail = checkEmailFormatValid(email);

    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: 'The provided email format is invalid.',
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'No employee found with the provided email.',
      });
    }

    if (employee && !employee.isVerified) {
      return res.status(404).json({
        success: false,
        message:
          'Your email is not verified yet, so you cannot reset the password.',
      });
    }

    const tenantId = employee.tenantId;

    if (!tenantId) {
      return res.status(404).json({
        success: false,
        message:
          'You are not associated with any company, so you cannot reset the password.',
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'The company associated with this account does not exist.',
      });
    }

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    const otp = generateOtp();
    const hashedOtp = await argon2.hash(otp);

    await prisma.employee.update({
      where: { email },
      data: {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordExpiry: expiryTime,
        isOtpVerified: false,
      },
    });

    const emailSent = await sendEmailForOtp(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send the OTP email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `An OTP for password reset has been sent to ${email}. It will expire in 10 minutes.`,
      otp,
    });
  } catch (error) {
    console.error('Error during forgot password process:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while processing your request. Please try again later.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// no auth
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const body: VerifyOtpInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required.',
      });
    }

    const parseResult = verifyOtpSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message: errorMessage,
      });
    }

    const { email, otp } = parseResult.data;

    const employee = await prisma.employee.findUnique({ where: { email } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'No employee found with this email.',
      });
    }

    if (!employee.forgotPasswordOtp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new password reset.',
      });
    }

    const isOtpValid = await argon2.verify(employee.forgotPasswordOtp, otp);
    const isOtpNotExpired =
      employee.forgotPasswordExpiry &&
      employee.forgotPasswordExpiry > new Date();

    if (!isOtpValid || !isOtpNotExpired) {
      return res.status(400).json({
        success: false,
        message: 'OTP is invalid or has expired.',
      });
    }

    const resetToken = v4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 10);
    const hashedResetToken = await argon2.hash(resetToken);

    await prisma.employee.update({
      where: { email },
      data: {
        forgotPasswordOtp: null,
        forgotPasswordExpiry: null,
        isOtpVerified: true,
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        'OTP verified successfully. Use the token to reset your password.',
      token: resetToken,
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while verifying OTP.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// no auth

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const body: ResetPasswordInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required.',
      });
    }

    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      const validationErrors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: validationErrors,
      });
    }

    const { email, newPassword, confirmNewPassword, token } = parseResult.data;

    const employee = await prisma.employee.findUnique({ where: { email } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'No employee found with this email.',
      });
    }

    if (!employee.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: 'OTP verification is required before resetting the password.',
      });
    }

    if (!employee.passwordResetToken || !employee.passwordResetTokenExpiry) {
      return res.status(400).json({
        success: false,
        message:
          'Reset link is invalid or already used. Please request a new one.',
      });
    }

    const isTokenValid = await argon2.verify(
      employee.passwordResetToken,
      token,
    );
    const isTokenNotExpired = employee.passwordResetTokenExpiry > new Date();

    if (!isTokenValid || !isTokenNotExpired) {
      return res.status(400).json({
        success: false,
        message:
          'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password must match.',
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await prisma.employee.update({
      where: { email },
      data: {
        password: hashedPassword,
        isOtpVerified: false,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
        forgotPasswordExpiry: null,
        forgotPasswordOtp: null,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while resetting the password.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// add auth middleware

export const fetchAuthenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. User ID not found in request.',
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: {
        fullname: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'User not found in the system.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully.',
      user: employee,
    });
  } catch (error) {
    console.error('Error fetching current user details:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching user details.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// add auth
export const getEmployeeAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const employeeId = req?.user?.id;

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const { email } = employee;
    const emailHash = crypto
      .createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex');
    const gravatarUrlCheck = `https://www.gravatar.com/avatar/${emailHash}?d=404`;
    const response = await fetch(gravatarUrlCheck);

    const avatarUrl: string =
      response.status === 200
        ? gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })
        : '';

    return res.status(200).json({
      success: true,
      message: 'Employee avatar retrieved successfully.',
      avatarUrl,
    });
  } catch (error) {
    console.error('Error retrieving employee avatar from Gravatar:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while retrieving the employee avatar.';

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// add auth and role will be admin
export const fetchAllEmployeesForTenant = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const loggedInEmployeeId = req?.user?.id;

    const loggedInEmployee = await prisma.employee.findUnique({
      where: { id: loggedInEmployeeId },
    });

    if (!loggedInEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Logged-in employee not found. Please check your credentials.',
      });
    }

    if (!loggedInEmployee.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified. Access denied.',
      });
    }

    const tenantId = loggedInEmployee.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Your employee record is not linked to any tenant.',
      });
    }
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Your company (tenant) does not exist.',
      });
    }

    if (!tenant.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your company(tenant) is not verified. Access denied.',
      });
    }

    const currentLoggedUserId = loggedInEmployeeId;

    const employees = await prisma.employee.findMany({
      where: {
        NOT: { id: currentLoggedUserId },
        tenantId,
        isVerified: true,
      },

      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: employees.length
        ? 'Successfully fetched all verified employees for your tenant.'
        : 'No verified employees found for this tenant.',
      employees,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching employees.';

    console.error('Error fetching employees:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// add auth and role will be admin

export const changeEmployeeRole = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const loggedInEmployeeId = req?.user?.id;

    const loggedInEmployee = await prisma.employee.findUnique({
      where: { id: loggedInEmployeeId },
    });

    if (loggedInEmployee && !loggedInEmployee.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified. Access denied.',
      });
    }

    const tenantId = loggedInEmployee?.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Your employee record is not linked to any tenant.',
      });
    }
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Your company (tenant) does not exist.',
      });
    }

    if (!tenant.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your company (tenant) is not verified. Access denied.',
      });
    }

    const requestData: ChangeRoleInput = req.body;

    if (!requestData) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the required inputs.',
      });
    }

    const validationResult = changeRoleSchema.safeParse(requestData);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { email, role } = validationResult.data;

    const targetEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!targetEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    if (!targetEmployee.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          'This account is not verified yet. Please complete registration before changing roles.',
      });
    }

    if (tenantId !== targetEmployee.tenantId) {
      return res.status(403).json({
        success: false,
        message:
          'You are not the owner of this tenetnt so you cannot chnage the role of other teannt ',
      });
    }
    await prisma.employee.update({
      where: { email },
      data: { role },
    });

    return res.status(200).json({
      success: true,
      message: `Role for ${targetEmployee.email} updated successfully to '${role}'.`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while updating the role.';

    console.error('Error updating employee role:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
