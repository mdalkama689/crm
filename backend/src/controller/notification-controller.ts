import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import prisma from 'backend/db';

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Unautheticated, please logged in to continue!',
      });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        employeeId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message:
        notifications.length > 0
          ? 'Notifications retrieved successfully.'
          : 'You don’t have any notifications yet.',
      notifications,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Something went wrong while retrieving notifications';

    console.error(errorMessage);
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const markNotificationAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Unautheticated, please logged in to continue!',
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required.',
      });
    }
    const notification = await prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return res.status(400).json({
        success: false,
        message: 'Notifications not found!',
      });
    }

    if (notification.employeeId !== userId) {
      return res.status(400).json({
        success: false,
        message: 'You are not authorized to view or update this notification.',
      });
    }

    if (!notification.seen) {
      await prisma.notification.update({
        where: {
          id,
        },
        data: {
          seen: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully.',
      notification,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Something went wrong while updating the notification.';

    console.log(errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};


export const markAllNotificationAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try { 

    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Unautheticated, please logged in to continue!',
      });
    }


    const totalNotifications = await prisma.notification.count({
      where: {
      employeeId: userId
      },
    });

    if(totalNotifications === 0){
      return res.status(200).json({
        success: true,
    message: "You have no notifications.",
      })
    }

 const result = await prisma.notification.updateMany({
      where: {
        employeeId: userId, 
        seen: false,  
      },
      data: {
        seen: true   
      }
    })

    return res.status(200).json({
      success: true,
      message:   result.count > 0
          ? `${result.count} notification(s) marked as read.`
          : "All notifications were already read.",
    });
  } catch (error) {
    const errorMessage = 
      error instanceof Error
        ? error.message
        : 'Something went wrong while read all  the notification.';

    console.log(errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};


