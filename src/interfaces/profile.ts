export interface IProfile {
    _id?: string;            // Optional, MongoDB will generate this field
    name: string;            // Full name of the individual
    email: string;           // Email address of the individual
    phone: string;           // Phone number of the individual
    position: string;        // Position of the individual (for both candidate and employee)
    department: string;      // Department the individual belongs to
    experience?: string;     // Experience, only relevant for candidates
    resume?: Buffer;         // Resume stored as binary data, only relevant for candidates
    img?: string;            // Image URL or path for the individual, only relevant for candidates
    status?: IProfileStatus;         // Status of the candidate (e.g., 'applied', 'interviewing', etc.)
    joining_date?: Date;    // Date the individual joined the company, only relevant for employees
    role: IProfileRole // Role of the individual (either 'candidate' or 'employee')
}
export enum IProfileRole {
    candidate = 'CANDIDATE',
    employee = 'EMPLOYEE',
}

export enum IProfileStatus {
    new = "NEW",
    Scheduled = "SCHEDULED",
    Selected = "SELECTED",
    rejected = "REJECTED"
}