import express from 'express';

export const get = async (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> => {
    res.status(202);
    res.json({ result: true });
}