import { Request, Response, NextFunction } from 'express';
import LeaveController from '../controllers/leave-controller';
import { LeaveStatus } from '../interfaces/leave';

const leaveController = new LeaveController();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = await leaveController.create(req.body);
        res.status(201).json({ message: 'Leave request created successfully', _id });
    } catch (error) {
        next(error);
    }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query.filters || {};
        const pagination = req.query.pagination || {};
        const sort = req.query.sort as string || 'date:asc';
        const searchText = req.query.searchText as string || '';
        console.log("searchText", searchText)
        const leaves = await leaveController.get(filters, pagination, sort, searchText);
        res.status(200).json(leaves);
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(LeaveStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid leave status' });
        }

        const updatedLeave = await leaveController.updateStatus(id, status);
        res.status(200).json({ message: 'Leave status updated successfully', leave: updatedLeave });
    } catch (error) {
        next(error);
    }
};

export const updateLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedLeave = await leaveController.update(id, updates);
        res.status(200).json({ message: 'Leave updated successfully', leave: updatedLeave });
    } catch (error) {
        next(error);
    }
};
