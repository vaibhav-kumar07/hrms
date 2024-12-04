import ProfileService from '../services/profile-service';
import { IProfile, IProfileRole, IProfileStatus } from '../interfaces/profile'; // Profile interface
import { checkAndThrowError, validateSchema } from '../utils/error-utils';
import { mandatoryString, profileSchema, updateProfileRoleSchema, updateProfileSchema, updateProfileStatusSchema } from '../validation-schemas/profile';


export default class ProfileController {
    private profileService = new ProfileService();

    public async create(profileData: IProfile) {
        const validationResult = validateSchema(profileSchema, profileData);

        checkAndThrowError(validationResult);
        return await this.profileService.create(profileData);
    }

    public async getCandidates(filters: any, pagination: any, sort: string, searchText?: string) {
        return await this.profileService.get(IProfileRole.candidate, filters, pagination, sort, searchText);
    }

    // Fetch employees
    public async getEmployees(filters: any, pagination: any, sort: string, searchText?: string) {
        return await this.profileService.get(IProfileRole.employee, filters, pagination, sort, searchText);
    }
    public async getById(id: string) {
        const validationResult = validateSchema(mandatoryString, id)
        checkAndThrowError(validationResult);
        return await this.profileService.getById(id);
    }

    public async update(id: string, profileData: Partial<IProfile>) {
        const validationResult = validateSchema(updateProfileSchema, {
            _id: id, profileData
        });
        checkAndThrowError(validationResult);
        return await this.profileService.update(id, profileData);
    }

    public async updateStatus(id: string, status: IProfileStatus) {
        const validationResult = validateSchema(updateProfileStatusSchema, {
            _id: id, status
        })
        checkAndThrowError(validationResult);
        return await this.profileService.updateStatus(id, status);
    }

    public async updateRole(id: string, role: IProfileRole) {
        const validationResult = validateSchema(updateProfileRoleSchema, { _id: id, role })
        checkAndThrowError(validationResult);
        return await this.profileService.updateRole(id, role);
    }
}

