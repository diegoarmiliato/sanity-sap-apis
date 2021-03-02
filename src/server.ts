import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.REACT_APP_API_PORT || 3333;

const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error: any = new Error('Page not Found');
  error['status'] = 404;
  next(error);
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error['status'] = error['status'] || 500;
  res.status(error['status']);
  res.json({ error: error['message'] });
});

const server = app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));

export { app, server };

