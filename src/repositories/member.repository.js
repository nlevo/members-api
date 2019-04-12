/**
 * The Member Repository
 */
class MemberRepository {
  get _baseParams() {
    return {
      TableName: 'members'
    };
  }

  /**
   * Contructs a new member repository
   * @param {AWS.DynamoDB.DocumentClient} documentClient The Document Client 
   */
  constructor(documentClient) {
    this._documentClient = documentClient;
  }

  /**
   * Gets a list of members
   * @returns {Promise<Models.Member[]>} A list of members
   */
  async list() {
    const params = this._createParamObject();
    const response = await this._documentClient.scan(params).promise();

    return response.Items || [];
  }

  /**
   * Gets a member by id
   * @param {string} id The member id
   * @returns {Promise<Models.Member>} The member
   */
  async get(id) {
    const params = this._createParamObject({ Key: { id } });
    const response = await this._documentClient.get(params).promise();

    return response.Item;
  }

  /**
   * Add or replace a member
   * @param {Models.Member} member The member
   * @returns {Promise<Models.Member>} The member
   */
  async put(member) {
    const params = this._createParamObject({ Item: member });
    await this._documentClient.put(params).promise();

    return member;
  }

  /**
   * Deletes a member by id
   * @param {string} id The member id
   * @return {Promise<string>} The id of the deleted member
   */
  async delete(id) {
    const params = this._createParamObject({ Key: { id } });
    await this._documentClient.delete(params).promise();

    return id;
  }

  _createParamObject(additionalArgs = {}) {
    return Object.assign({}, this._baseParams, additionalArgs);
  }
}

exports.MemberRepository = MemberRepository;