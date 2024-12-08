import Attendance from '../models/attendance'; // Attendance model
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';

export default class AttendanceService {
    // Private save method for creating or updating attendance records
    private async save(input: Partial<IAttendance>, isNew: boolean = true): Promise<IAttendance> {
        const attendance = new Attendance(input);
        attendance.isNew = isNew;
        return (await attendance.save()).toObject();
    }

    // Create a new attendance record
    public async create(attendanceData: IAttendance): Promise<string> {
        return (await this.save(attendanceData, true))._id as string;
    }


    public async getByEmployeeAndDate(employeeId: string, date: string): Promise<IAttendance | null> {
        // Convert date string to Date object
        const dateObject = new Date(date);
        return await Attendance.findOne({
            employeeId,
            date: dateObject, // MongoDB expects a Date object for exact match
        }).lean();
    }

    // Update attendance status
    public async updateStatus(employeeId: string, date: string, status: AttendanceStatus) {
        const dateObject = new Date(date); // Convert to Date object
        const attendance = await this.getByEmployeeAndDate(employeeId, dateObject.toISOString());

        if (attendance) {
            return await this.save({ ...attendance, status }, false);
        } else {
            const attendanceData: IAttendance = {
                employeeId,
                date: dateObject, // Store as Date object
                task: '',
                status,
            };
            return await this.create(attendanceData);
        }
    }


    public async updateTask(employeeId: string, date: string, task: string) {
        const dateObject = new Date(date); // Convert to Date object
        const attendance = await this.getByEmployeeAndDate(employeeId, dateObject.toISOString());

        if (attendance) {
            return await this.save({ ...attendance, task }, false);
        } else {
            const attendanceData: IAttendance = {
                employeeId,
                date: dateObject, // Store as Date object
                task,
                status: AttendanceStatus.WORK_FROM_HOME, // Default status
            };
            return await this.create(attendanceData);
        }
    }


}
