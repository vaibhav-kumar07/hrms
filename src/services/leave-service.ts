import Leave from '../models/leave';
import { ILeave, LeaveStatus } from '../interfaces/leave';
import { applyPagination } from '../utils/pagination-sort-utils';
import { throwBusinessError } from '../utils/error-utils';
import { parseFilters } from '../utils/filter-utils';

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
    public async get(filters: any, pagination: any, sort: string, today: string, searchText?: string): Promise<any> {
        const { limit, skip } = applyPagination(pagination);
        const criteria = { ...parseFilters(filters) };
        if (searchText) {
            criteria.$or = [
                { name: { $regex: searchText, $options: 'i' } }
            ];
        }
        console.log("criteria called ", today)
        if (today) {
            criteria.date = today;
        }
        const leaveList = await Leave.find(criteria)
            .collation({ locale: 'en' })
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
