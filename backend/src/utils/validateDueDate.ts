export function validateDueDate(dueDate: string) {
  const yearFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (dueDate?.trim()) {
    if (!yearFormatRegex.test(dueDate)) {
      return {
        success: false,
        message: 'invalid due date:',
      };
    }

    const currentDate = new Date();
    const dueDateInFormat = new Date(dueDate);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate > dueDateInFormat) {
      return {
        success: false,
        message: 'Due date cannot be in past!',
      };
    }
  }

  return {
    success: true,
    message: 'Due date is correct!',
  };
}
