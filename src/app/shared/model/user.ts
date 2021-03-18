import { Branch } from "./branch";

export class User {
  public id: number;
  public firstname: string;
  public lastname: string;
  public phonenumber: number;
  public hirearchyLevel: number;
  public branch: Branch[];
  public group: Array<any> = [];
  public email: string;
  public _token: string;
  public phone1: number;
  public phone2: number;
  public addressLine1: string;
  public addressLine2: string;

  get token(): string {
    return this._token;
  }

  get fullName(): string {
    return this.firstname + " " + this.lastname;
  }

  get firstName() {
    return this.firstname;
  }

  get lastName() {
    return this.lastname;
  }

  get userid() {
    return this.id;
  }

  deSerialize(input) {
    this.id = input.id;
    this.firstname = input.firstname;
    this.lastname = input.lastname;
    this.phonenumber = input.phonenumber;
    this.phone1 = input.phone1;
    this.phone2 = input.phone2;
    this.addressLine1 = input.address_line_1;
    this.addressLine2 = input.address_line_2;
    this.email = input.email;
    this.branch = [];
    if (input.branch instanceof Array) {
      input.branch.forEach((branch) => {
        this.branch.push(new Branch().deserialize(branch));
      })
    } else {
      this.branch.push(new Branch().deserialize(input.branch));
    }
    this.group = input.groups;
    this.hirearchyLevel = input.hirearchy_level;
    this._token = input.token;
    return this;
  }

  get role() {
    return this.group;
  }
}


