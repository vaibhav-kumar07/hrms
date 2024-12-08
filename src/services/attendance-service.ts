import Attendance from '../models/attendance'; // Attendance model
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';


export default class AttendanceService {

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
        // Since date is now a string, we can directly match the date string
        return await Attendance.findOne({
            employeeId,
            date, // Match the exact date string
        }).lean();
    }

    // Update attendance status (ignore time, only match the date string)
    public async updateStatus(employeeId: string, date: string, status: AttendanceStatus) {
        const attendance = await this.getByEmployeeAndDate(employeeId, date);

        if (attendance) {
            return await this.save({ ...attendance, status }, false);
        } else {
            const attendanceData: IAttendance = {
                employeeId,
                date, // Store date as string
                task: '',
                status,
            };
            return await this.create(attendanceData);
        }
    }

    // Update attendance task (ignore time, only match the date string)
    public async updateTask(employeeId: string, date: string, task: string) {
        const attendance = await this.getByEmployeeAndDate(employeeId, date);

        if (attendance) {
            return await this.save({ ...attendance, task }, false);
        } else {
            const attendanceData: IAttendance = {
                employeeId,
                date, // Store date as string
                task,
                status: AttendanceStatus.WORK_FROM_HOME, // Default status
            };
            return await this.create(attendanceData);
        }
    }
}
