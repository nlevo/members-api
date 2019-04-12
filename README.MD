
This project is an example of **RESTful API using AWS Lambda, API Gateway, DynamoDB and the Serverless Framework.**

This project uses:
- **serverless framework** - for managing deployments to AWS.
- **serverless-offline** - for emulating AWS API Gateway and AWS Lambda on your localhost.
- **serverless-dynamodb-local** - for emulating DynamoDB on your localhost.
- **aws-sdk** - the official AWS SDK for JavaScript, used to access various AWS services from code.
- **jest** - unit testing framework.
- **dotenv** - a module for storing and setting environment variables.
- **faker** - a module to generate massive amounts of fake data. 
##SETUP

##### LOCAL MACHINE:

##### Requirements: 
- Node.js, 8.10.x
- Java Runtime Engine (JRE) version 6.x or newer
- Serverless framework `npm install -g serverless`

1. **Create .env file** in the root of the project. This file is used for storing environment variables.
```
AWS_ENDPOINT='http://localhost:8000'
AWS_REGION='localhost'
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
```
2. `npm install`
3. `sls dynamodb install`
4. `sls dynamodb start`
5. `npm run seed` - (optional) populate fake data to DynamoDB
6. `npm run test && npm run test:coverage` - (optional) run tests.
6. `npm start` - you will see a list of routes, you can start testing them using tools like Postman.
