import { z } from 'zod';
import { LeaveStatus } from '../interfaces/leave';

export const leaveSchema = z.object({
    name: z.string()
        .nonempty("Name is required")
        .min(3, "Name must be at least 3 characters long") // Ensure name is at least 3 characters
        .max(100, "Name must be less than 100 characters"), // Limit name length to 100

    date: z.coerce.date()
        .refine((d) => d >= new Date(), "Date must be in the future") // Ensure the date is in the future
        .refine((d) => !isNaN(d.getTime()), "Invalid date format"), // Ensure valid date format

    reason: z.string()
        .nonempty("Reason is required")
        .min(5, "Reason must be at least 5 characters long") // Minimum length for reason
        .max(500, "Reason must be less than 500 characters"), // Max length for reason

    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional() // Status is optional
        .default("PENDING"), // Default status is "PENDING" if not provided
});


// Leave Schema for updating the leave status
export const leaveUpdateStatusSchema = z.object({
    status: z.enum([LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED], {
        errorMap: () => ({ message: "Invalid leave status. Expected 'PENDING', 'APPROVED', or 'REJECTED'" })
    })
});

export const leaveUpdateSchema = z.object({
    name: z.string().optional(),

    date: z.coerce.date().optional().refine((d) => {
        // Only apply the check if the date is not undefined
        if (d) {
            return d >= new Date();
        }
        return true; // If the date is undefined, skip this check
    }, "Date must be in the future"),

    reason: z.string()
        .min(5, "Reason must be at least 5 characters long")
        .optional(), // Validate reason only if it's provided

    status: z.enum([LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED]).optional(),
});