import { Request, Response, NextFunction } from "express";

import { upload } from "../services/multer.service";

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    upload(req, res, (err): void => {
        if (err) {
            res.status(400).json({ success: false, message: err.message });
            return;
        } else {
            next();
        }
    });
}