interface IGenerateNotification {
  adminName: string;
  projectName: string;
}

export function generateNotificationForProject({
  adminName,
  projectName,
}: IGenerateNotification) {
  const message = `${adminName.charAt(0).toUpperCase() + adminName.slice(1)} has created a project: ${projectName}`;
  return message;
}
