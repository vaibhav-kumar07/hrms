import { z } from 'zod';
import { IProfileRole, IProfileStatus } from '../interfaces/profile';
export const mandatoryString = z.string().trim().min(1);
export const mongooseId = mandatoryString.refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
    message: 'Invalid id format',
});
// Define the schema for IProfile interface
export const profileSchema = z.object({
    // Optional, as _id is auto-generated by MongoDB
    name: z.string().min(1, "Name is required"),  // Name must be a non-empty string
    email: z.string().email("Invalid email address"),  // Email must be a valid email address
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),  // Phone number must be at least 10 characters
    position: z.string().optional(), // Position must be non-empty
    department: z.string().min(1, "Department is required"), // Department must be non-empty
    experience: z.string(), // Experience is optional, only for candidates
    resume: z.instanceof(Buffer).optional(), // Resume is optional, stored as binary data (for candidates)
    img: z.string().optional(), // Image URL/path, optional for candidates
    status: z.string().optional(), // Status, optional for candidates
    joining_date: z.date().optional(), // Joining date is optional, relevant for employees
    role: z.enum([IProfileRole.candidate, IProfileRole.employee]) // Role must be either CANDIDATE or EMPLOYEE
});

export const updateProfileStatusSchema = z.object({
    _id: mongooseId,
    status: z.enum([IProfileStatus.new, IProfileStatus.Selected, IProfileStatus.Scheduled, IProfileStatus.rejected], {
        errorMap: () => ({ message: "Invalid status. Expected 'NEW', 'SCHEDULED', 'SELECTED', or 'REJECTED'." }),
    }),
});

export const updateProfileRoleSchema = z.object({
    _id: mongooseId,
    role: z.enum([IProfileRole.candidate, IProfileRole.employee], {
        errorMap: () => ({ message: "Invalid role. Expected 'CANDIDATE' or 'EMPLOYEE'." }),
    }),
});


export const updateProfileAttenceSchema = z.object({
    _id: mongooseId,
    attendance: z.enum([IProfileRole.candidate, IProfileRole.employee], {
        errorMap: () => ({ message: "Invalid role. Expected 'CANDIDATE' or 'EMPLOYEE'." }),
    }),
});




// Update Profile Schema
export const updateProfileSchema = z.object({
    _id: mongooseId,
    name: z.string().min(1, "Name cannot be empty").optional(), // Name is optional but should be validated if provided
    email: z.string().email("Invalid email address").optional(), // Email is optional but should be validated if provided
    phone: z.string().min(10, "Phone number must be at least 10 characters long").optional(), // Phone number is optional but should be validated if provided
    position: z.string().min(1, "Position cannot be empty").optional(), // Position is optional but should be validated if provided
    department: z.string().min(1, "Department cannot be empty").optional(), // Department is optional but should be validated if provided
    joining_date: z.date().optional(), // Joining date is optional but should be validated if provided
});
