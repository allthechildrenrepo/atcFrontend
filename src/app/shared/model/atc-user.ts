import { Branch } from "./branch";

export class AtcUser {
  public id: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public userProfile: DonarProfile;
  public atcProfile: AtcProfile;
  public branch: Branch;
  public group: AtcGroup[] = [];

  deserialize(input) {
    if (!input) return this;
    this.id = input.id;
    this.username = input.username;
    this.firstName = input.first_name;
    this.lastName = input.last_name;
    this.email = input.email == 'null' ? undefined : input.email;
    if (input.branch) {
      this.branch = new Branch().deserialize(input.branch);
    }
    if (input.user_profile)
      this.userProfile = new DonarProfile().deserialize(input.user_profile);
    if (input.atc_profile)
      this.atcProfile = new AtcProfile().deserialize(input.atc_profile);
    if (input.groups instanceof Array) {
      input.groups.forEach(group =>
        this.group.push(new AtcGroup().deserialize(group))
      );
    }
    return this;
  }

  get atcId() {
    if (this.atcProfile)
      return this.atcProfile.atcId
    return "ATC"
  }

  get fullName() {
    let firstName = this.firstName ? this.firstName : "";
    let lastName = this.lastName ? this.lastName : "";
    return firstName + " " + lastName;
  }
}

export class DonarProfile {
  public profileId: string;
  public branch: Branch;
  public addressLine1: string;
  public addressLine2: string;
  public phone1: string;
  public phone2: string;
  public panCard: string;
  public gender: string;
  public userId: string;

  deserialize(input) {
    if (!input) return this;
    this.profileId = input.id;
    this.branch = new Branch().deserialize(input.branch[0]);
    this.addressLine1 = input.address_line_1;
    this.addressLine2 = input.address_line_2;
    this.phone1 = input.phone1 == 'null' ? '' : input.phone1;
    this.phone2 = input.phone2 == 'null' ? '' : input.phone2;
    this.panCard = input.pan_card == 'null' ? '' : input.pan_card;
    this.gender = input.gender;
    this.userId = input.user;

    return this;
  }
}

export class AtcProfile {
  public atcId: string;
  public branch: Branch[];
  public voiceCallingName: string;
  public voiceCallingNumber1: string;
  public voiceCallingNumber2: string;
  public voiceCallingNumber3: string;
  public addressLine1: string;
  public addressLine2: string;
  public panCard: string;
  public gender: string;

  deserialize(input) {
    if (!input) return this;
    this.atcId = input.atc_id;
    if (input.branch) {
      if (input.branch instanceof Array) {
        this.branch = input.branch.map(singleBranch => new Branch().deserialize(singleBranch));
      } else {
        this.branch = [new Branch().deserialize(input.branch)];
      }
    }
    this.voiceCallingName = input.telecalling_name;
    this.voiceCallingNumber1 = input.voice_calling_number;
    this.voiceCallingNumber2 = input.voice_calling_number2;
    this.voiceCallingNumber3 = input.voice_calling_number3;
    this.addressLine1 = input.address_line_1;
    this.addressLine2 = input.address_line_2;
    this.panCard = input.pan_card;
    this.gender = input.gender;
    return this;
  }
}

export class AtcGroup {
  public id: string;
  public name: string;
  public permissions = [];
  deserialize(input) {
    if (!input) return this;
    this.id = input.id;
    this.name = input.name;
    this.permissions = input.permissions;
    return this;
  }
}
