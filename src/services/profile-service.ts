import Profile from '../models/profile'; // Profile model
import { IProfile, IProfileRole, IProfileStatus } from '../interfaces/profile'; // Profile interface and Role enum
import { applyPagination, applySort } from '../utils/pagination-sort-utils';
import { parseFilters } from '../utils/filter-utils';
import { throwBusinessError } from '../utils/error-utils'; // Import throwBusinessError

export default class ProfileService {

    private async save(input: Partial<IProfile>, isNew: boolean = true): Promise<IProfile> {
        const profile = new Profile(input);
        profile.isNew = isNew;
        return (await profile.save()).toObject();
    }

    // Get a profile by ID
    public async getById(id: string): Promise<IProfile | null> {
        const profile = await Profile.findById(id).lean();
        return profile;
    }

    // Get a profile by Email
    public async getByEmail(email: string): Promise<IProfile | null> {
        const profile = await Profile.findOne({ email }).lean();
        return profile;
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
    public async get(role: IProfileRole, filters: any, pagination: any, sort: string, searchText?: string): Promise<any> {
        const { limit, skip } = applyPagination(pagination);
        const sortObj = applySort(sort);
        const criteria = { ...parseFilters(filters), role };

        if (searchText) {
            criteria.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { email: { $regex: searchText, $options: 'i' } },
                { phone: { $regex: searchText, $options: 'i' } },
            ];
        }

        // Fetch profiles based on the criteria
        const profileList = await Profile.find(criteria)
            .sort(sortObj as any)
            .collation({ locale: 'en' })
            .skip(skip)
            .limit(limit)
            .lean();

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
        await this.save({ ...profile, ...profileData }, false); // Update profile with new data
    }

    // Update profile status (only for candidates)
    public async updateStatus(id: string, status: IProfileStatus) {
        const profile = await this.getById(id);

        // Throw business error if profile not found
        throwBusinessError(!profile, 'Profile not found');

        // Status updates are allowed only for candidates
        throwBusinessError(profile?.role !== IProfileRole.candidate, 'Status updates are allowed only for candidates');

        // Use save to update the status
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
}
