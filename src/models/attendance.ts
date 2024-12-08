import mongoose, { Schema, Document } from 'mongoose';
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';

const attendanceSchema: Schema = new Schema<IAttendance>({
    employeeId: {
        type: String, required: true
    },
    date: {
        type: Date, required: true
    },
    task: { type: String },
    status: {
        type: String,
        enum: Object.values(AttendanceStatus),
        default: AttendanceStatus.ABSENT,

    },
}, {
    collection: "attendance"
});

export default mongoose.model<IAttendance & Document>('Attendance', attendanceSchema);
