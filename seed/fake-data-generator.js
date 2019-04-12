const faker = require('faker');

const generateFakeData = (records) => {
    var bigSet = [];

    for (var i = records; i >= 0; i--) {
        bigSet.push({
            id:faker.random.uuid(),
            email: faker.internet.email(),
            firstname: faker.name.firstName(),
            lastName: faker.name.lastName(),
            phone: faker.phone.phoneNumber(),
            address: [{
                address1: faker.address.streetAddress(),
                address2: faker.address.secondaryAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode()
            }],
            birthday:faker.date.between('1950-01-01', '2005-12-31').toDateString()

        });
    };
    return bigSet;
};

module.exports = { generateFakeData };