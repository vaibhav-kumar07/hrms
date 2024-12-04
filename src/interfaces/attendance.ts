export interface IAttendance {
    _id?: string;           // MongoDB ID
    employeeName: string;   // Employee's name
    designation: string;    // Employee's designation
    department: string;     // Employee's department
    task: string;           // Task details
    status: AttendanceStatus; // Status of attendance
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    WORK_FROM_HOME = 'WORK_FROM_HOME',
    MEDICAL_LEAVE = 'MEDICAL_LEAVE',
}
