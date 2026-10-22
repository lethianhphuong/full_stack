export type Gender = 'Nam' | 'Nữ' | 'Khác';
export type IncidentType = '' | 'tron' | 'chet';

export type Address = {
  street: string;
  ward: string;
  province: string;
  country: string;
};

export type AddressKey = 'birthPlace' | 'homeTown' | 'permanent' | 'temporary' | 'current';
export type AddressBook = Record<AddressKey, Address>;

export type Relation = {
  id: string;
  fullName: string;
  birthYear: string;
  gender: Gender;
  identityNumber: string;
  relation: string;
  currentAddress: string;
};

export type RelationInput = Omit<Relation, 'id'>;

export type IncidentReason = { id: string; name: string; officerAction: string };
export type IncidentDetail = {
  place: string;
  otherPlace: string;
  eventDate: string;
  recaptureDate: string;
  content: string;
  outcome: string;
  officerOutcome: string;
};

export type Incident = {
  enabled: boolean;
  agency: string;
  agencyDetail: string;
  agencySubdetail: string;
  otherAgency: string;
  type: IncidentType;
  escapeReasons: IncidentReason[];
  deathReasons: IncidentReason[];
  escapeDetail: IncidentDetail;
  deathDetail: IncidentDetail;
};

export type PersonFormValues = {
  role: string;
  fullName: string;
  gender: Gender | '';
  birthDate: string;
  identityNumber: string;
  noIdentityReason: string;
  otherName: string;
  identityIssueDate: string;
  identityIssuePlace: string;
  ethnicity: string;
  nationality: string;
  passport: string;
  passportIssueDate: string;
  passportIssuePlace: string;
  education: string;
  occupation: string;
  position: string;
  workplace: string;
  phone: string;
  familyBackground: string;
  religion: string;
  partyMember: string;
  criminalRecord: string;
  criminalRecordDetails: string;
  addresses: AddressBook;
  hasPreviousAddresses: boolean;
  previousAddresses: AddressBook;
  drugIssue: string;
  armedForces: string;
  professionalSubject: string;
  health: string;
  relations: Relation[];
  incident: Incident;
};

export type PersonRecord = PersonFormValues & {
  id: string;
  createdAt: string;
};
