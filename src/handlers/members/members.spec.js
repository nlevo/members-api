
// TODO: consider breaking this out into individual suites

describe('Members', () => {
  const mockMemberRepository = {
    list: () => [],
    get: id => null,
    put: member => null,
    delete: id => null
  };

  const testmembers = [
    { id: '1', name: 'Jin Erso' },
    { id: '2', name: 'Rey' },
    { id: '3', name: 'Kylo Ren' }
  ];

  const mockWithStatusCode = jest.fn();
  const mockResponseUtil = {
    withStatusCode: (stat, fn) => mockWithStatusCode
  };

  const mockParseWith = jest.fn();
  const mockRequestUtil = {
    parseWith: (parser) => mockParseWith
  };

  const mockDynamoDbFactory = {
    withProcessEnv: (env) => jest.fn()
  };

  jest.mock('aws-sdk/clients/dynamodb', () => ({ DocumentClient: jest.fn() }));
  jest.mock('../../repositories/member.repository', () => ({ MemberRepository: jest.fn(() => mockMemberRepository) }));
  jest.mock('../../utils/response.util', () => mockResponseUtil);
  jest.mock('../../utils/request.util', () => mockRequestUtil);

  describe('list handler', () => {
    const { handler } = require('./list');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));
    });

    it('should return a list of members', async () => {
      jest.spyOn(mockMemberRepository, 'list').mockResolvedValue(testmembers);

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testmembers)
      };

      const response = await handler({});

      expect(response).toBeDefined();
      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.list).toHaveBeenCalled();
      expect(mockWithStatusCode).toHaveBeenCalled();
    });
  });

  describe('get handler', () => {
    const { handler } = require('./get');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));
    });

    it('should get a member by id', async () => {
      jest.spyOn(mockMemberRepository, 'get').mockImplementation(id => Promise.resolve(testmembers[id] || null));

      const id = 1;
      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testmembers[id])
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.get).toHaveBeenCalledWith(id);
      expect(mockWithStatusCode).toHaveBeenCalled();
    });

    it('should return a 404 not found if a member does not exist', async () => {
      jest.spyOn(mockMemberRepository, 'get').mockResolvedValue(null);

      mockWithStatusCode.mockClear();
      mockWithStatusCode.mockImplementation(_ => ({ statusCode: 404 }));

      const id = 1000;
      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 404
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.get).toHaveBeenCalledWith(id);
      expect(mockWithStatusCode).toHaveBeenCalled();
    });
  });

  describe('add handler', () => {
    const { handler } = require('./add');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 201 }));
      mockParseWith.mockImplementation(text => JSON.parse(text));

    });

    it('should create a new member', async () => {
      jest.spyOn(mockMemberRepository, 'put').mockImplementation((data) => Promise.resolve(data));

      const member = {
        id: '4',
        name: 'Han Solo'
      };

      const event = {
        body: JSON.stringify(member)
      };

      const expectedResponse = {
        statusCode: 201
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.put).toHaveBeenCalledWith(member);
    });
  });

  describe('delete handler', () => {
    const { handler } = require('./delete');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation(() => ({ statusCode: 204 }));
    });

    it('should delete a member', async () => {
      jest.spyOn(mockMemberRepository, 'delete').mockResolvedValue('1');

      const id = '1';

      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 204
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('update handler', () => {
    const { handler } = require('./update');

    beforeEach(() => {
      jest.resetAllMocks();
      mockParseWith.mockImplementation(text => JSON.parse(text));
    });

    it('should create a new member', async () => {
      jest.spyOn(mockMemberRepository, 'put').mockImplementation((data) => Promise.resolve(data));
      jest.spyOn(mockMemberRepository, 'get').mockResolvedValue({ id: '3' });

      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));

      const member = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(member)
      };

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(member)
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.put).toHaveBeenCalledWith(member);
      expect(mockMemberRepository.get).toHaveBeenCalledWith('3');
    });

    it('should return 404 not found if member does not exist', async () => {
      jest.spyOn(mockMemberRepository, 'put').mockRejectedValue('unexpected call to put');
      jest.spyOn(mockMemberRepository, 'get').mockResolvedValue(null);

      mockWithStatusCode.mockImplementation(() => ({ statusCode: 404 }));

      const member = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(member)
      };

      const expectedResponse = {
        statusCode: 404
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.get).toHaveBeenCalledWith('3');

      expect(mockMemberRepository.put).not.toHaveBeenCalledWith(member);
    });

    it('should return 400 bad request if member id does not match', async () => {
      jest.spyOn(mockMemberRepository, 'put').mockRejectedValue('unexpected call to put');
      jest.spyOn(mockMemberRepository, 'get').mockResolvedValue({ id: '1000' });

      mockWithStatusCode.mockImplementation(() => ({ statusCode: 400 }));

      const member = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(member)
      };

      const expectedResponse = {
        statusCode: 400
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockMemberRepository.get).toHaveBeenCalledWith('3');

      expect(mockMemberRepository.put).not.toHaveBeenCalledWith(member);
    });
  });
});