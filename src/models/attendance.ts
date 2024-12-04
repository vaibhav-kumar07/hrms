import mongoose, { Schema, Document } from 'mongoose';
import { IAttendance, AttendanceStatus } from '../interfaces/attendance';

const attendanceSchema: Schema = new Schema<IAttendance>({
    employeeName: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    task: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(AttendanceStatus),
        required: true
    },
}, {
    collection: "attendance"
});

export default mongoose.model<IAttendance & Document>('Attendance', attendanceSchema);
