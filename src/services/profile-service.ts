import Profile from '../models/profile'; // Profile model
import { IProfile, IProfileRole, IProfileStatus } from '../interfaces/profile'; // Profile interface and Role enum
import { applyPagination, applySort } from '../utils/pagination-sort-utils';
import { parseFilters } from '../utils/filter-utils';
import { throwBusinessError } from '../utils/error-utils'; // Import throwBusinessError
import AttendanceService from './attendance-service';
import { AttendanceStatus } from '../interfaces/attendance';

export default class ProfileService {
    private attendanceService = new AttendanceService();

    private async save(input: Partial<IProfile>, isNew: boolean = true): Promise<IProfile> {
        const profile = new Profile(input);
        profile.isNew = isNew;
        return (await profile.save()).toObject();
    }

    // Get a profile by ID
    public async getById(id: string): Promise<IProfile> {
        const profile = await Profile.findById(id).lean();
        throwBusinessError(!profile, "Profile not found");
        return profile as IProfile;
    }

    // Get a profile by Email
    public async getByEmail(email: string): Promise<IProfile | null> {
        const profile = await Profile.findOne({ email }).lean();
        return profile as IProfile;
    }

    // Create a new profile (candidate or employee)
    public async create(profileData: IProfile): Promise<string> {
        const existingProfile = await this.getByEmail(profileData.email); // Check if profile already exists

        // Throw business error if profile already exists
        throwBusinessError(!!existingProfile, 'Profile already exists with this email');

        // If no existing profile, save the new profile
        return (await this.save(profileData, true))._id as string;
    }

    // Get profiles based on role, filters, pagination, and sorting
    public async get(
        role: IProfileRole,
        filters: any,
        pagination: any,
        sort: string,
        today: string,
        searchText?: string
    ): Promise<any> {
        const { limit, skip } = applyPagination(pagination);
        const criteria = { ...parseFilters(filters), role };

        if (searchText) {
            criteria.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { email: { $regex: searchText, $options: 'i' } },
                { phone: { $regex: searchText, $options: 'i' } },
                { position: { $regex: searchText, $options: 'i' } },
                { department: { $regex: searchText, $options: 'i' } },
            ];
        }

        const date = today; // Use today directly (in YYYY-MM-DD format)

        const profileList = await Profile.aggregate([
            { $match: criteria }, // Apply profile filters
            { $skip: skip },      // Pagination skip
            { $limit: limit },    // Pagination limit
            {
                $lookup: {
                    from: 'attendance',
                    let: { profileId: { $toString: '$_id' } }, // Convert ObjectId to string
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$employeeId', '$$profileId'] }, // Match employeeId
                                        { $eq: ['$date', date] } // Match date exactly as string
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'attendance'
                }
            },
            {
                $unwind: {
                    path: '$attendance',
                    preserveNullAndEmptyArrays: true, // Keep profiles with no attendance
                }
            },
            {
                $addFields: {
                    task: { $ifNull: ['$attendance.task', ''] }, // Default empty task
                    attendance_status: { $ifNull: ['$attendance.status', ''] }, // Default empty status
                }
            },
            {
                $project: {
                    attendance: 0 // Remove raw attendance data
                }
            }
        ]);


        console.log("Profiles with today's attendance", profileList);

        const totalCount = await Profile.countDocuments(criteria);

        return {
            data: profileList,
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


    // Update profile data
    public async update(id: string, profileData: Partial<IProfile>) {
        const profile = await this.getById(id);

        // Throw business error if profile not found
        throwBusinessError(!profile, 'Profile not found');

        // Use save to update the profile
        await this.save({ ...profile, ...profileData }, false);
    }

    // Update profile status (only for candidates)
    public async updateStatus(id: string, status: IProfileStatus) {
        const profile = await this.getById(id);
        throwBusinessError(!profile, 'Profile not found');
        throwBusinessError(
            profile?.role !== IProfileRole.candidate,
            'Status updates are allowed only for candidates'
        );

        if (status === IProfileStatus.Selected) {
            profile.role = IProfileRole.employee;
        }
        await this.save({ ...profile, status }, false);
    }

    // Update profile role (e.g., candidate to employee)
    public async updateRole(id: string, role: IProfileRole) {
        const profile = await this.getById(id);

        // Throw business error if profile not found
        throwBusinessError(!profile, 'Profile not found');

        // Update the role in the profile
        const updatedProfile = { ...profile, role };

        // Use save to persist the changes
        return await this.save(updatedProfile, false);
    }

    // Update attendance status
    public async updateAttendanceStatus(employeeId: string, status: AttendanceStatus, today: string) {
        const employee = await Profile.findById(employeeId);
        if (!employee) {
            throwBusinessError(true, 'Employee not found');
        }

        return await this.attendanceService.updateStatus(employeeId, today, status);
    }

    // Update attendance task
    public async updateAttendanceTask(employeeId: string, task: string, today: string) {
        const employee = await Profile.findById(employeeId);
        if (!employee) {
            throwBusinessError(true, 'Employee not found');
        }
        return await this.attendanceService.updateTask(employeeId, today, task);
    }
}
