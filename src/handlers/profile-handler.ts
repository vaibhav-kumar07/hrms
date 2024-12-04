import { Request, Response, NextFunction } from 'express';
import ProfileController from '../controllers/profile-controller';
const profileController = new ProfileController();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = await profileController.create(req.body);  // Pass profile data to controller
        res.status(201).json({ message: 'Profile created successfully', _id });
    } catch (error) {
        next(error);
    }
};

// Get all candidates with filters, pagination, sorting, and search text
export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query.filters || {};
        const pagination = req.query.pagination || {};
        const sort = req.query.sort as string || 'name:asc';
        const searchText = req.query.searchText as string || '';

        const candidates = await profileController.getCandidates(filters, pagination, sort, searchText);
        res.status(200).json(candidates);
    } catch (error) {
        next(error);  // Pass error to the error handler
    }
};

// Get all employees with filters, pagination, sorting, and search text
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query.filters || {};
        const pagination = req.query.pagination || {};
        const sort = req.query.sort as string || 'name:asc';
        const searchText = req.query.searchText as string || '';
        const employees = await profileController.getEmployees(filters, pagination, sort, searchText);
        res.status(200).json(employees);
    } catch (error) {
        next(error);  // Pass error to the error handler
    }
};



export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await profileController.getById(req.params.id);  // Get profile by ID
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await profileController.update(req.params.id, req.body);  // Pass ID and data to controller
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await profileController.updateStatus(req.params.id, req.body.status);  // Update status of profile
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await profileController.updateRole(req.params.id, req.body.role);  // Update role of profile
        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        next(error);
    }
};
