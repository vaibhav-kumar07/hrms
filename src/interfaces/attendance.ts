export interface IAttendance {
    _id?: string
    employeeId: string
    date: string
    task: string;
    status: AttendanceStatus

}
export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    WORK_FROM_HOME = 'WORK_FROM_HOME',
    MEDICAL_LEAVE = 'MEDICAL_LEAVE',
}
