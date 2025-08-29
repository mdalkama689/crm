interface IGenerateNotificationForProject {
  adminName: string;
  projectName: string;
}

interface IGenerateNotificationForTask {
  taskCreatorName: string;
  taskName: string;
}

export function generateNotificationForProject({
  adminName,
  projectName,
}: IGenerateNotificationForProject) {
  const message = `${adminName.charAt(0).toUpperCase() + adminName.slice(1)} has created a project: ${projectName}`;
  return message;
}

export function generateNotificationForTask({
  taskCreatorName,
  taskName,
}: IGenerateNotificationForTask) {
  const message = `${taskCreatorName.charAt(0).toUpperCase() + taskCreatorName.slice(1)} has assigned a task: ${taskName} to you`;
  return message;
}

export function generateNotificationForAddTask({
  taskCreatorName,
  taskName,
}: IGenerateNotificationForTask) {
  const message = `${taskCreatorName.charAt(0).toUpperCase() + taskCreatorName.slice(1)} has created a task: ${taskName}`;
  return message;
}



