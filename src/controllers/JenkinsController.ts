import { buildJob, Jenkins } from '@models/Jenkins';
import express from 'express';

export const post = async (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> => {
    res.json(await buildJob(<Jenkins><unknown>(req.query)));
}