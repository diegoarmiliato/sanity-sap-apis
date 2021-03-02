import { post } from '@controllers/JenkinsController';
import { get } from '@controllers/TestController'
import express from 'express';

const routes = express.Router();

routes
  .post('/jenkinsBuild', post)
  .get('/test', get)

export default routes;
