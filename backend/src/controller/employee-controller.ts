import { Request, Response } from 'express';
import argon2 from 'argon2';
import prisma from 'backend/db';
import {
  employeeSignUpInput,
  employeeSignUpSchema,
} from 'shared/src/schema/employee-sign-up-schema';
import { log } from 'shared/src/logger';
import {
  SignInInputUser,
  signInSchema,
} from 'shared/src/schema/sign-in-schema';
import { generateAccessToken } from '../utils/token';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { checkEmailFormatValid } from '../utils/checkEmailFormatValid';
import { generateOtp } from '../utils/generateOtp';
import { sendEmailForOtp } from '../utils/sendEmail';
import {
  VerifyOtpInput,
  verifyOtpSchema,
} from 'shared/src/schema/verify-otp-schema';
import { v4 } from 'uuid';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from 'shared/src/schema/reset-password-schema';
import gravatar from 'gravatar';
import crypto from 'crypto';

const accessTokencookieOptions = {
  httpOnly: true,
  seure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000,
};

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

    const { fullname, password, token, email } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found!',
      });
    }

    if (user.isAccountCreated || user.isInvitedTokenUsed) {
      return res.status(400).json({
        success: false,
        message: 'You already have an account!',
      });
    }

    const isValidToken = await argon2.verify(user.invitationToken, token);
    const isTokenNotExpired =
      !!user.invitationTokenExpiry && user.invitationTokenExpiry > new Date();

    console.log(' both : ', isValidToken, isTokenNotExpired);
    console.log(' user.invitationToken, token : ', user.invitationToken, token);
    if (!isValidToken || !isTokenNotExpired) {
      return res.status(400).json({
        success: false,
        message: 'Your invitation link is invalid or has expired.',
      });
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.employee.update({
      where: { email },
      data: {
        fullname,
        password: hashedPassword,
        isAccountCreated: true,
        isInvitedTokenUsed: true,
        invitationToken: '',
        invitationTokenExpiry: undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Account created successfully!',
    });
  } catch (error) {
    log.error('Error during validate and Signup an employee acoount: ', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error during validate and Signup an employee acoount: ';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const body: SignInInputUser = req.body;
    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs.',
      });
    }
    const parseResult = signInSchema.safeParse(body);
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

    const { email, password } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email not found.',
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials!.',
      });
    }

    const refeshToken = await generateAccessToken(user);

    const accessToken = await generateAccessToken(user);

    const refeshTokencookieOptions = {
      httpOnly: true,
      seure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    };

    res.cookie('refreshToken', refeshToken, refeshTokencookieOptions);
    res.cookie('accessToken', accessToken, accessTokencookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
    });
  } catch (error) {
    log.error('Signin error : ', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refeshToken;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Your session has ended. Please log in again.',
      });
    }
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if (!REFRESH_TOKEN_SECRET) return;

    interface CustomJWTPayload extends JwtPayload {
      id: string;
      role: string;
    }

    const decoded = (await jwt.verify(
      token,
      REFRESH_TOKEN_SECRET,
    )) as CustomJWTPayload;

    if (!decoded.id) {
      return res.status(400).json({
        success: false,
        message: 'unauthorized user, Please logged in to continue',
      });
    }

    const payload = {
      id: decoded.id,
      role: decoded.role,
    };

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) return;
    const newAccessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('accessToken', newAccessToken, accessTokencookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
    });
  } catch (error) {
    log.error('Refresh token Error : ', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const logout = (_: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return res.status(200).json({
      success: true,
      message: 'log out successfully!',
    });
  } catch (error) {
    log.error('Logout Error : ', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const subscribeNewLetter = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide input!',
      });
    }
    const { email }: { email: string } = req.body;

    if (!email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email!',
      });
    }

    const isValidEmail = checkEmailFormatValid(email);

    if (!isValidEmail) {
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
        message: 'User not found!',
      });
    }

    await prisma.employee.update({
      where: { email },
      data: {
        isNewsLetterSubscribe: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'You have successfully subscribed to the newsletter.',
      user,
    });
  } catch (error) {
    log.error('Error during subscribing to the newsletter:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error during subscribing to the newsletter.';
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide input',
      });
    }

    const { email }: { email: string } = body;

    if (!email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email!',
      });
    }

    const isValidEmail = checkEmailFormatValid(email);

    if (!isValidEmail) {
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
        message: 'User not found!',
      });
    }

    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);

    const otp = generateOtp();
    const hashedOtp = await argon2.hash(otp);
    await prisma.employee.update({
      where: { email },
      data: {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordExpiry: date,
      },
    });

    const responseSendEmail = await sendEmailForOtp(email, otp);

    if (!responseSendEmail) {
      return res.status(400).json({
        success: false,
        message: 'An error occurred while sending the email.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `A forgot password OTP has been sent to ${email}.`,
    });
  } catch (error) {
    log.error('Error during sending forgot password email:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while processing the forgot password request.';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const body: VerifyOtpInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs!',
      });
    }
    const parseResult = verifyOtpSchema.safeParse(body);

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

    const { email, otp } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        messsage: 'User not found!',
      });
    }

    if (!user.forgotPasswordOtp) {
      return res.status(200).json({
        success: false,
        message: 'OTP not found. Please request a password reset again.',
      });
    }

    const isOtpValid = await argon2.verify(user.forgotPasswordOtp, otp);

    const isOtpExpire =
      user.forgotPasswordExpiry && user.forgotPasswordExpiry > new Date();

    if (!isOtpValid || !isOtpExpire) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired otp',
      });
    }

    const token = v4();

    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const hashedUrl = await argon2.hash(token);

    await prisma.employee.update({
      where: { email },
      data: {
        forgotPasswordOtp: null,
        forgotPasswordExpiry: null,
        isVerifiedOtp: true,
        forgotPasswordUrlExpiry: date,
        forgotPasswordUrl: hashedUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Otp verification successfully!',
      token,
    });
  } catch (error) {
    log.error('Error during verifying OTP:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while verifying OTP.';

    return res.status(400).json({
      success: false,
      message: errorMessage || 'Error during verifying OTP.',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const body: ResetPasswordInput = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputs.',
      });
    }

    const parseResult = resetPasswordSchema.safeParse(body);
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

    const { email, confirmNewPassword, newPassword, token } = parseResult.data;

    const user = await prisma.employee.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isVerifiedOtp) {
      return res.status(200).json({
        success: false,
        message: 'OTP verification is required before resetting your password.',
      });
    }

    if (!user.forgotPasswordUrl) {
      return res.status(200).json({
        success: false,
        message: 'Reset link is invalid or already used.',
      });
    }

    const isValidUrl = await argon2.verify(user.forgotPasswordUrl, token);

    const isValidUrlTime =
      user.forgotPasswordUrlExpiry && user.forgotPasswordUrlExpiry > new Date();

    if (!isValidUrl || !isValidUrlTime) {
      return res.status(400).json({
        success: false,
        message:
          'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(200).json({
        success: false,
        message: 'New password and confirm password must match.',
      });
    }

    const hasedPassword = await argon2.hash(newPassword);

    await prisma.employee.update({
      where: {
        email,
      },
      data: {
        password: hasedPassword,
        isVerifiedOtp: false,
      },
    });
    return res.status(200).json({
      success: true,
      message:
        'Your password has been reset successfully. You can now log in with the new password.',
      token,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error during reseting password';
    log.error(' errorMessage : ', errorMessage);
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const userDetails = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    const role = req.user?.role;
    let user;
    if (role && role.toLowerCase() === 'owner') {
      user = await prisma.company.findUnique({
        where: { id },
        select: {
          fullname: true,
          email: true,
                role: true
        },
      });
    } else  {
      user = await prisma.employee.findUnique({
        where: { id },
        select: {
          fullname: true,
          email: true,
          role: true
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User details fetch successfully.',
      user,
    });
  } catch (error) {
    log.error('user details  : ', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    return res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

export const fetchProfilePhotoFromGravatar = async (
  req: Request,
  res: Response,
) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(400).json({
        success: false,
        message: 'Unauthenticated, please login to continue!',
      });
    }

    const { role, id } = loggedInUser;
    let user;

    if (role.trim().toLowerCase() === 'owner') {
      user = await prisma.company.findUnique({
        where: {
          id,
        },
      });
    } else {
      user = await prisma.employee.findUnique({
        where: {
          id,
        },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found!',
      });
    }

    const { email } = user;

    const hash = crypto
      .createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex');
    const checkUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;
    const response = await fetch(checkUrl);

    let avatarUrl: string = '';
    if (response.status === 200) {
      avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    }
    return res.status(200).json({
      success: true,
      message: 'Avatar image fetched successfully!',
      avatarUrl,
    });
  } catch (error) {
    console.error(
      'Error while fetching user profile pic from gravatar:',
      error,
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error while fetching user profile pic from gravatar';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};


