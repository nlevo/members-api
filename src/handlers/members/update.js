require('dotenv/config');

const { MemberRepository } = require('../../repositories/member.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new MemberRepository(docClient);
const ok = withStatusCode(200);
const badRequest = withStatusCode(400);
const notFound = withStatusCode(404);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body, pathParameters } = event;
  const { id } = pathParameters;

  const existingMember = await repository.get(id);
  const member = parseJson(body);

  if (!existingMember) {
    return notFound();
  }

  if (existingMember.id !== member.id) {
    return badRequest();
  }

  // todo: merge or overwrite?
  const updatedMember = Object.assign({}, existingMember, member);

  await repository.put(updatedMember);

  return ok(updatedMember);
};