import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { Result } from './Result';

const JENKINS_URL = process.env.REACT_APP_JENKINS_URL;
const JENKINS_JOB_NAME = process.env.REACT_APP_JENKINS_JOB_NAME;
const API_USERNAME = process.env.REACT_APP_JENKINS_USERNAME || '';
const API_KEY = process.env.REACT_APP_JENKINS_APIKEY || '';

const api = axios.create({
    headers: { 
      'Content-Type': 'application/json; charset=utf-8'
    },
    withCredentials: true,
    auth: {
      username: API_USERNAME, 
      password: API_KEY 
    }
  });

export interface Jenkins {
    buildExec: boolean,
    sUser: string,
    sPass: string,
    tns: string,
    dbConn: string,
    osgtVersion: string,
    itSapVersion: string,
    wsUrl: string,
    parentBuild: string,
    dataCenter: string,
    mailTo: string
}

export const buildJob = async (params: Jenkins) : Promise<Result> => {
  if (JENKINS_URL && JENKINS_JOB_NAME && API_USERNAME && API_KEY) {
    const apiUrl = `${JENKINS_URL}/job/${JENKINS_JOB_NAME}/buildWithParameters`;
    try {
      const res = await api.post(apiUrl, null, { params: params });
      const { location } = res.headers;
      if (location) {
        const url = (apiUrl.includes('https://')) ? location.replace('http://', 'https://') : location;
        return await apiQueueCall(url);
      } else {
        return ({ message: `Could not execute JOB ${JENKINS_JOB_NAME}`, status: false });
      }
    } catch (err) {
      console.log(err);
      return ({ message: err, status: false });
    }
    } else {
    return ({ message: 'API call configuration not Found', status: false });
  }
}

const apiQueueCall = async (apiQueueUrl: string) : Promise<Result> => {
    let status = false;
    for await (const val of Array(10)) {
      if (!status) {
        try {
          const res = await api.post(`${apiQueueUrl}api/json`)
          const { executable } = res.data;
          if (executable) {   
            return apiJobBuildLogCall(executable.number);
          }
        } catch (err) {
          console.log(err);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    return ({ message: 'Job Build URL could not be found', status: false });
  };
  
  const apiJobBuildLogCall = async (buildId: string) : Promise<Result> => {
    let status = false;
    const apiUrl = `${JENKINS_URL}/job/${JENKINS_JOB_NAME}/${buildId}/api/json`;
    for await (const val of Array(60)) {
      if (!status) {
        try {
          const res = await api.get(apiUrl)
          const { building, result } = res.data;
          if (!building) {
            if (result) {
              return ({ message: `Build Id ${buildId} of Job ${JENKINS_JOB_NAME} finished with ${result}` , status: true});
            }
          }
        } catch (err) {
          console.log(err);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    return ({ message: 'Job Build Log could not be found', status: false });
  };