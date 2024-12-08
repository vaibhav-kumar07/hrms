import { AttendanceStatus } from "./attendance";

export interface IProfile {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    experience?: string;
    resume?: Buffer;
    img?: string;
    status?: IProfileStatus;
    joining_date?: Date;
    role: IProfileRole
    task?: string;
    attendance_status?: AttendanceStatus;
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