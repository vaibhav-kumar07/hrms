import Attendance from '../models/attendance'; // Attendance model
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';
import { applyPagination, applySort } from '../utils/pagination-sort-utils';

export default class AttendanceService {
    // Private save method for creating or updating attendance records
    private async save(input: Partial<IAttendance>, isNew: boolean = true): Promise<IAttendance> {
        const attendance = new Attendance(input);
        attendance.isNew = isNew;
        return (await attendance.save()).toObject();
    }

    // Create a new attendance record
    public async create(attendanceData: IAttendance): Promise<string> {
        return (await this.save(attendanceData, true))._id as string
    }

    // Get all attendance records with optional filters
    public async get(filters: any, pagination: any, sort: string): Promise<any> {
        const { limit, skip } = applyPagination(pagination);
        const sortObj = applySort(sort);

        const attendanceList = await Attendance.find(filters)
            .sort(sortObj as any)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalCount = await Attendance.countDocuments(filters);

        return {
            data: attendanceList,
            meta: {
                pagination: {
                    page: skip / limit + 1,
                    pageSize: limit,
                    pageCount: Math.ceil(totalCount / limit),
                    total: totalCount,
                },
            },
        };
    }

    // Update attendance status
    public async updateStatus(id: string, status: AttendanceStatus) {
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }

        return await this.save({ ...attendance.toObject(), status }, false);
    }

    // Update attendance task
    public async updateTask(id: string, task: string) {
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }

        return await this.save({ ...attendance.toObject(), task }, false);
    }
}
