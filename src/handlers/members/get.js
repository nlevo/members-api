
require('dotenv/config');

const { MemberRepository } = require('../../repositories/member.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new MemberRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);
const notFound = withStatusCode(404);

exports.handler = async (event) => {
  const { id } = event.pathParameters;
  const member = await repository.get(id);

  if (!member){
    return notFound();
  }

  return ok(member);
};