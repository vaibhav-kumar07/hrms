import AttendanceService from '../services/attendance-service';
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';

export default class AttendanceController {
    private attendanceService = new AttendanceService();

    public async create(attendanceData: IAttendance): Promise<string> {
        return await this.attendanceService.create(attendanceData);
    }

    public async get(filters: any, pagination: any, sort: string): Promise<any> {
        return await this.attendanceService.get(filters, pagination, sort);
    }

    public async updateStatus(id: string, status: AttendanceStatus) {
        return await this.attendanceService.updateStatus(id, status);
    }

    public async updateTask(id: string, task: string) {
        return await this.attendanceService.updateTask(id, task);
    }
}
