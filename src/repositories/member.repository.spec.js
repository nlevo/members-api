const { MemberRepository } = require('./member.repository');

describe('Members Repository', () => {
  /** @type {AWS.DynamoDB.DocumentClient} */
  const mockDocClient = {
    scan: params => { },
    // query: params => mockAwsRequest,
    get: params => { },
    put: params => { },
    delete: params => { },
    // update: params => { }
  };

  const mockMembers = [
    { id: '1', name: 'Jin Erso' },
    { id: '2', name: 'Luke Skywalker' },
    { id: '3', name: 'Darth Vadar' }
  ];

  const createAwsRequest = (data = null, resolveOrReject = true, errMsg = 'error') => {
    return {
      promise: () => resolveOrReject ? Promise.resolve(data) : Promise.reject(new Error('error'))
    };
  };

  /** @type {MembersRepository} */
  let respository;

  beforeEach(() => {
    respository = new MemberRepository(mockDocClient);
  });

  it('should construct a new respository', () => {
    expect(respository).toBeDefined();
  });

  it('should list members', async () => {
    const expectedResult = {
      Items: mockMembers.slice()
    };

    spyOn(mockDocClient, 'scan').and.returnValues(createAwsRequest(expectedResult), createAwsRequest({ Items: null }));

    const awsParams = {
      TableName: 'members'
    };

    const results = await respository.list();

    expect(results).toEqual(expectedResult.Items);
    expect(results.length).toBe(3);
    expect(mockDocClient.scan).toHaveBeenCalledWith(awsParams);

    const emptyResults = await respository.list();

    expect(emptyResults).toEqual([]);
  });

  it('should throw an error when listing fails', async () => {
    spyOn(mockDocClient, 'scan').and.returnValue(createAwsRequest(null, false));

    try {
      await respository.list();

      fail('listing should have failed with an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('error');
    }
  });

  it('should get a member by id', async () => {
    const expectedResult = {
      Item: Object.assign({}, mockMembers[0])
    };

    spyOn(mockDocClient, 'get').and.returnValue(createAwsRequest(expectedResult));

    const id = '1';
    const awsParams = {
      TableName: 'members',
      Key: { id }
    };

    const member = await respository.get(id);

    expect(member).toBeDefined();
    expect(member).toEqual(expectedResult.Item);
    expect(mockDocClient.get).toHaveBeenCalledWith(awsParams);
  });

  it('should put a new item in the db', async () => {
    spyOn(mockDocClient, 'put').and.returnValue(createAwsRequest());

    const newMember = {
      id: '4',
      name: 'Han Solo'
    };

    const awsParams = {
      TableName: 'members',
      Item: newMember
    };

    const member = await respository.put(newMember);

    expect(member).toBeDefined();
    expect(mockDocClient.put).toHaveBeenCalledWith(awsParams);
  });

  it('should delete a member, by id', async () => {
    spyOn(mockDocClient, 'delete').and.returnValue(createAwsRequest());

    const id = '1';
    const awsParams = { TableName: 'members', Key: { id } };

    const deletedid = await respository.delete(id);

    expect(deletedid).toBe(id);
    expect(mockDocClient.delete).toHaveBeenCalledWith(awsParams);
  });
});
