import mongoose, { Schema } from 'mongoose';
import { IProfile, IProfileRole, IProfileStatus } from '../interfaces/profile';

const profileSchema: Schema = new Schema<IProfile>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, },
    department: { type: String, required: true },
    experience: { type: String, required: true }, // Optional for candidates
    resume: { type: Buffer },     // Optional for candidates
    img: { type: String },        // Optional for candidates
    status: { type: String, enum: Object.values(IProfileStatus) }, // Optional for candidates
    joining_date: { type: Date }, // Optional for employees
    role: { type: String, required: true, enum: Object.values(IProfileRole) }, // Role field
}
    , {
        collection: "profile"
    });

export default mongoose.model<IProfile>('Profile', profileSchema);
