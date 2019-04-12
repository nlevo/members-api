namespace Models {
  interface Member {
    id: string;
    firstName: string;
    lastName: string;
    phones: PhoneNumber[];
    addresses: Address[];
    birthday: string;
  }

  interface PhoneNumber {
    country: number;
    area: number;
    no: number;
    ext: number;
  }

  interface Address {
    address1: string;
    address2: string
    city: string;
    state: string;
    zip: number;
  }

  interface Response {
    statusCode: number;
    body?: string | any;
  }
}