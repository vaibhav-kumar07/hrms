import { Request, Response, NextFunction } from 'express';
import AttendanceController from '../controllers/attendance-controller';
import { AttendanceStatus } from '../interfaces/attendance';

const attendanceController = new AttendanceController();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await attendanceController.create(req.body);
        res.status(201).json({ message: 'Attendance recorded  successfully', attendance });
    } catch (error) {
        next(error);
    }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query.filters || {};
        const pagination = req.query.pagination || {};
        const sort = req.query.sort as string || 'date:asc';

        const attendance = await attendanceController.get(filters, pagination, sort);
        res.status(200).json(attendance);
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(AttendanceStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid attendance status' });
        }

        await attendanceController.updateStatus(id, status);
        res.status(200).json({ message: 'Attendance status updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { task } = req.body;

        await attendanceController.updateTask(id, task);
        res.status(200).json({ message: 'Attendance task updated successfully' });
    } catch (error) {
        next(error);
    }
};
