import LeaveService from '../services/leave-service';
import { ILeave, LeaveStatus } from '../interfaces/leave';
import { checkAndThrowError, validateSchema } from '../utils/error-utils';
import { leaveSchema, leaveUpdateSchema, leaveUpdateStatusSchema } from '../validation-schemas/leave';

export default class LeaveController {
    private leaveService = new LeaveService();

    public async create(leaveData: ILeave): Promise<string> {
        const validationResult = validateSchema(leaveSchema, leaveData);
        checkAndThrowError(validationResult);
        return await this.leaveService.create(leaveData);
    }

    public async get(filters: any, pagination: any, sort: string): Promise<any> {
        return await this.leaveService.get(filters, pagination, sort);
    }

    public async updateStatus(id: string, status: LeaveStatus): Promise<ILeave> {
        const validationResult = validateSchema(leaveUpdateStatusSchema, {
            status
        });
        checkAndThrowError(validationResult);
        return await this.leaveService.updateStatus(id, status);
    }

    public async update(id: string, updates: Partial<ILeave>): Promise<ILeave> {
        const validationResult = validateSchema(leaveUpdateSchema, {
            updates
        });
        checkAndThrowError(validationResult);
        return await this.leaveService.updateLeave(id, updates);
    }
}
