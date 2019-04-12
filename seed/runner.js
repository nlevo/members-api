require('dotenv/config');

const { MemberSeeder } = require('./member.seeder');
const { DynamoDB } = require('aws-sdk');
const { DocumentClient } = DynamoDB;
const { generateFakeData } = require('./fake-data-generator');

const dynamo = new DynamoDB({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const doclient = new DocumentClient({ service: dynamo });
const memberSeeder = new MemberSeeder(dynamo, doclient);

const log = (...mgs) => console.log('>>', ...mgs);

const seedMembers = async () => {
  log(`Checking if 'members' table exists`);

  const exists = await memberSeeder.hasTable();

  if (exists) {
    log(`Table 'members' exists, deleting`);
    await memberSeeder.deleteTable();
  }

  log(`Creating 'members' table`);
  await memberSeeder.createTable();

  log('Seeding data');
  let numberOfRecords =  process.env.FAKE_SEED_RECORDS || 20;
  let fakeData = generateFakeData(numberOfRecords);
  await memberSeeder.seed(fakeData);
  log(JSON.stringify(fakeData, null, 2))
  log(`Successfully generated and saved ${numberOfRecords} records to DynamoDB`);
};

seedMembers()
  .then(() => log('Done!'))
  .catch(err => console.log(err));