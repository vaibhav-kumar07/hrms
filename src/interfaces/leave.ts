export interface ILeave {
    _id?: string;
    name: string;
    date: string;
    reason: string;
    status: LeaveStatus;
    docs?: Buffer;
}

export enum LeaveStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}
