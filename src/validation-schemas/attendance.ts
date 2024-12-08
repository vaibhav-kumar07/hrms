import { z } from 'zod';
import { AttendanceStatus } from '../interfaces/attendance';
export const mandatoryString = z.string().trim().min(1);
export const mongooseId = mandatoryString.refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
    message: 'Invalid id format',
});
export const todayDateSchema = z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.endsWith("Z");
}, {
    message: "Invalid date format, please provide a valid GMT date",
});

export const todayAndTaskSchema = z.object({
    _id: mongooseId,
    date: todayDateSchema,
    task: z.string().min(10, { message: "Task must be at least 10 characters long" }),
});

export const todayAndStatusSchema = z.object({
    _id: mongooseId,
    date: todayDateSchema,
    status: z.enum([AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.WORK_FROM_HOME, AttendanceStatus.MEDICAL_LEAVE], {
        message: 'Invalid attendance status'
    }),
});