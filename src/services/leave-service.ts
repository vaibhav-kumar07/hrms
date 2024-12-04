import Leave from '../models/leave';
import { ILeave, LeaveStatus } from '../interfaces/leave';
import { applyPagination, applySort } from '../utils/pagination-sort-utils';
import { throwBusinessError } from '../utils/error-utils';

export default class LeaveService {
    // Private save method for creating or updating leaves
    private async save(input: Partial<ILeave>, isNew: boolean = true): Promise<ILeave> {
        const leave = new Leave(input);
        leave.isNew = isNew;
        return (await leave.save()).toObject();
    }

    // Create a leave request
    public async create(leaveData: ILeave): Promise<string> {

        const existingLeave = await Leave.findOne({
            name: leaveData.name,
            date: leaveData.date,
        });
        throwBusinessError(!!existingLeave, 'A leave request for this date already exists.');
        return (await this.save(leaveData, true))._id as string;
    }

    // Get all leave requests with optional filters
    public async get(filters: any, pagination: any, sort: string): Promise<any> {
        const { limit, skip } = applyPagination(pagination);
        const sortObj = applySort(sort);
        const leaveList = await Leave.find(filters)
            .sort(sortObj as any)
            .skip(skip)
            .limit(limit)
            .lean();


        const totalCount = await Leave.countDocuments(filters);
        return {
            data: leaveList,
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

    // Update leave status

    public async updateStatus(id: string, status: LeaveStatus): Promise<ILeave> {
        const leave = await Leave.findById(id);
        throwBusinessError(!leave, 'Leave not found');
        return await this.save({ ...leave!.toObject(), status }, false);


    }
    // Update leave reason and documents
    public async updateLeave(id: string, updates: Partial<ILeave>): Promise<ILeave> {
        const leave = await Leave.findById(id);
        throwBusinessError(!leave, 'Leave not found');
        return await this.save({ ...leave!.toObject(), ...updates }, false);
    }
}
