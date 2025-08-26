import { useEffect, useState } from 'react';
import { axiosInstance } from '../../api/axios';
import {
  Bell,
  CheckSquare,
  Clock,
  FolderOpen,
  MessageCircle,
} from 'lucide-react';
import type { NotificationProps, NotificationResponse, TypeIcon } from './type';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../slices/store';
import { setNotificationCount } from '../../slices/sidebar/SideBarSlice';
import { useNavigate } from 'react-router-dom';
import { AxiosHeaders } from 'axios';

const Notification = () => {
  const [notificationList, setNotificationList] = useState<NotificationProps[]>(
    [],
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleMarkAllAsRead = () => {};

  const fetchAllNotifications = async () => {
    try {
      const response =
        await axiosInstance.get<NotificationResponse>('/notification/all');

      if (response.data.success) {
        setNotificationList(response.data.notifications);
      }
    } catch (error) {
      console.log(' error : ', error);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="w-4 h-4 text-white" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-white" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-white" />;
      default:
        return <Bell className="w-4 h-4 text-white" />;
    }
  };

  const getIconBackgroundColor = (type: TypeIcon): string => {
    const colors: Record<TypeIcon, string> = {
      PROJECT: 'bg-blue-400',
      COMMENT: 'bg-green-500',
      TASK: 'bg-purple-500',
    };

    return colors[type] || 'bg-green-500';
  };

  const unreadCount = notificationList.filter((notify) => !notify.seen).length;

  const getInAgo = (date: Date) => {
    const relativeTime = formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
    return relativeTime;
  };

  useEffect(() => {
    if (!notificationList || notificationList.length === 0) return;

    dispatch(setNotificationCount(unreadCount));
  }, [notificationList]);

  const navigate = useNavigate();

  const markAsRead = async (id: string) => {
    try {
      console.log(' syatt');
      const response = await axiosInstance.get(`/notification/${id}`);
      console.log(' response via marl : ', response);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToEntity = (
    entityType: TypeIcon,
    enitityId: string,
    notificationId: string,
  ) => {
    markAsRead(notificationId);
    if (entityType === 'PROJECT') {
      navigate(`/project/${enitityId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Activity
                      {unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {unreadCount} unread
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Stay updated with your latest notifications
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {notificationList.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.seen
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'bg-white'
                    }`}
                    onClick={() =>
                      navigateToEntity(
                        notification.entityType,
                        notification.enitityId,
                        notification.id,
                      )
                    }
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${getIconBackgroundColor(notification.entityType)}`}
                      >
                        {getNotificationIcon(notification.entityType)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-5 ${
                          !notification.seen
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {notification.text}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />

                        <span className="text-gray-500 text-sm italic">
                          {getInAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {!notification.seen && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))}

                {notificationList.length === 0 && (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No notifications
                    </h3>
                    <p className="text-gray-600">
                      You're all caught up! No new notifications at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
