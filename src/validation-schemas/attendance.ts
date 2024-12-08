import { z } from 'zod';
import { AttendanceStatus } from '../interfaces/attendance';

// Helper: String validation with a minimum length
export const mandatoryString = z.string().trim().min(1);

// Helper: Mongoose ID validation
export const mongooseId = mandatoryString.refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
    message: 'Invalid id format',
});

// Helper: Date format validation (only YYYY-MM-DD)
export const todayDateSchema = z.string().refine((value) => {
    // Regex to check if date is in YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
}, {
    message: "Invalid date format, please provide a valid YYYY-MM-DD date string",
});

// Schema for `todayAndTaskSchema`
export const todayAndTaskSchema = z.object({
    _id: mongooseId,         // Profile ID validation
    date: todayDateSchema,   // Date in YYYY-MM-DD format
    task: z.string().min(10, { message: "Task must be at least 10 characters long" }),  // Task validation
});

// Schema for `todayAndStatusSchema`
export const todayAndStatusSchema = z.object({
    _id: mongooseId,  // Profile ID validation
    date: todayDateSchema,  // Date in YYYY-MM-DD format
    status: z.enum([AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.WORK_FROM_HOME, AttendanceStatus.MEDICAL_LEAVE], {
        message: 'Invalid attendance status'
    }),  // Status validation
});
