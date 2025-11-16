/* import for node */
import 'source-map-support/register';
/* import express */
import serverlessExpress from '@codegenie/serverless-express';
/* import app */
import app from '@/main';

/* export = lambdaに合わせる */
export const handler = serverlessExpress({ app });
