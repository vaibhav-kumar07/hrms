import mongoose, { Schema, Document } from 'mongoose';
import { ILeave, LeaveStatus } from '../interfaces/leave';

const leaveSchema: Schema = new Schema<ILeave>({
    name: { type: String, required: true },
    date: { type: Date, required: true, unique: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(LeaveStatus),
        default: LeaveStatus.PENDING,
        required: true
    },
    docs: { type: Buffer },
}, { collection: "leave" });

export default mongoose.model<ILeave & Document>('Leave', leaveSchema);
