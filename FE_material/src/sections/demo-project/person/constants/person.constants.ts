import type { Address, AddressBook, AddressKey, IncidentDetail, PersonFormValues, PersonRecord, RelationInput } from '../types';

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

export const ROLE_OPTIONS = toOptions(['Bị can', 'Bị cáo', 'Bị hại', 'Người làm chứng', 'Nguyên đơn dân sự', 'Bị đơn dân sự', 'Người có quyền lợi, nghĩa vụ liên quan', 'Người bào chữa', 'Người giám định', 'Người phiên dịch', 'Người đại diện hợp pháp']);
export const GENDER_OPTIONS = toOptions(['Nam', 'Nữ', 'Khác']);
export const OCCUPATION_OPTIONS = toOptions(['Không nghề nghiệp', 'Nông dân', 'Công nhân', 'Cán bộ, công chức', 'Kinh doanh', 'Học sinh, sinh viên', 'Lao động tự do', 'Khác']);
export const EDUCATION_OPTIONS = toOptions(['Không biết chữ', 'Tiểu học', '9/12', '12/12', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Sau đại học']);
export const ETHNICITY_OPTIONS = toOptions(['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer', 'Hoa', 'Nùng', "H'Mông", 'Dao', 'Khác']);
export const NATIONALITY_OPTIONS = toOptions(['Việt Nam', 'Lào', 'Campuchia', 'Trung Quốc', 'Khác']);
export const RELIGION_OPTIONS = toOptions(['Không', 'Phật giáo', 'Công giáo', 'Tin lành', 'Cao Đài', 'Hòa Hảo', 'Hồi giáo', 'Khác']);
export const FAMILY_OPTIONS = toOptions(['Nông dân', 'Công nhân', 'Cán bộ, viên chức', 'Tiểu thương', 'Khác']);
export const YES_NO_OPTIONS = toOptions(['Không', 'Có']);
export const RECORD_OPTIONS = toOptions(['Không', 'Tiền án', 'Tiền sự', 'Cả tiền án và tiền sự']);
export const DRUG_OPTIONS = toOptions(['Không', 'Có sử dụng', 'Nghiện', 'Đang cai nghiện']);
export const FORCE_OPTIONS = toOptions(['Không', 'Quân đội', 'Công an', 'Cơ yếu']);
export const SUBJECT_OPTIONS = toOptions(['Không', 'Đối tượng sưu tra', 'Đối tượng truy nã', 'Đối tượng quản lý nghiệp vụ khác']);
export const ADDRESS_KEYS: { key: AddressKey; label: string }[] = [
  { key: 'birthPlace', label: 'Nơi sinh' }, { key: 'homeTown', label: 'Quê quán' }, { key: 'permanent', label: 'Nơi ĐKTT' }, { key: 'temporary', label: 'Nơi tạm trú' }, { key: 'current', label: 'Nơi ở hiện tại' },
];
export const WARD_OPTIONS = toOptions(['Phường Ba Đình', 'Phường Hoàn Kiếm', 'Phường Cầu Giấy', 'Phường Đống Đa', 'Xã Đông Anh', 'Xã Sóc Sơn', 'Phường Thanh Xuân', 'Xã Gia Lâm']);
export const PROVINCE_OPTIONS = toOptions(['Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế', 'Quảng Ninh', 'Thanh Hóa', 'Nghệ An', 'Lâm Đồng', 'Đồng Nai', 'Khánh Hòa']);
export const COUNTRY_OPTIONS = NATIONALITY_OPTIONS;

export const AGENCY_OPTIONS = toOptions(['Trại tạm giam', 'Nhà tạm giữ', 'Trụ sở công an', 'Khác']);
export const AGENCY_DETAIL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  'Trại tạm giam': toOptions(['Trại tạm giam số 1 - CA TP Hà Nội', 'Trại tạm giam số 2 - CA TP Hà Nội', 'Trại tạm giam Chí Hòa', 'Trại tạm giam T16 - Bộ Công an']),
  'Nhà tạm giữ': toOptions(['Nhà tạm giữ CA quận Ba Đình', 'Nhà tạm giữ CA quận Đống Đa', 'Nhà tạm giữ CA TP Thủ Đức', 'Nhà tạm giữ CA huyện Gia Lâm']),
  'Trụ sở công an': toOptions(['Cơ quan CSĐT', 'Cơ quan khác', 'Công an xã']),
};
export const AGENCY_SUBDETAIL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  'Cơ quan CSĐT': toOptions(['Cơ quan CSĐT Bộ Công an', 'Cơ quan CSĐT CA TP Hà Nội', 'Cơ quan CSĐT CA quận Cầu Giấy', 'Cơ quan CSĐT CA huyện Đông Anh']),
  'Cơ quan khác': toOptions(['Cơ quan An ninh điều tra', 'Bộ đội Biên phòng', 'Cảnh sát biển', 'Kiểm lâm', 'Hải quan']),
  'Công an xã': toOptions(['Công an phường Ba Đình', 'Công an phường Hoàn Kiếm', 'Công an xã Đông Anh', 'Công an xã Sóc Sơn']),
};
export const ESCAPE_REASON_OPTIONS = toOptions(['Phá buồng giam, giữ', 'Tấn công cán bộ', 'Sơ hở của cán bộ', 'Khác']);
export const DEATH_REASON_OPTIONS = toOptions(['Bệnh lý', 'Tự sát', 'Bị cán bộ đánh', 'Bị đối tượng đánh', 'Khác']);
export const INCIDENT_PLACE_OPTIONS = toOptions(['Trại tạm giam', 'Nhà tạm giữ', 'Trụ sở công an', 'Trên đường dẫn giải, áp giải', 'Khác']);
export const ESCAPE_OUTCOME_OPTIONS = toOptions(['Khởi tố vụ án', 'Khởi tố bị can', 'Truy nã đối tượng', 'Không khởi tố - Truy nã', 'Không khởi tố - Truy tìm']);

export const RELATION_OPTIONS = toOptions(['Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Khác']);

export const EMPTY_ADDRESS: Address = { street: '', ward: '', province: '', country: 'Việt Nam' };
export const createAddressBook = (): AddressBook => Object.fromEntries(ADDRESS_KEYS.map(({ key }) => [key, { ...EMPTY_ADDRESS }])) as AddressBook;
export const EMPTY_INCIDENT_DETAIL: IncidentDetail = { place: '', otherPlace: '', eventDate: '', recaptureDate: '', content: '', outcome: '', officerOutcome: '' };

export const createDefaultPerson = (): PersonFormValues => ({
  role: '', fullName: '', gender: '', birthDate: '', identityNumber: '', noIdentityReason: '', otherName: '', identityIssueDate: '', identityIssuePlace: '', ethnicity: 'Kinh', nationality: 'Việt Nam', passport: '', passportIssueDate: '', passportIssuePlace: '', education: '', occupation: '', position: '', workplace: '', phone: '', familyBackground: '', religion: 'Không', partyMember: 'Không', criminalRecord: 'Không', criminalRecordDetails: '', addresses: createAddressBook(), hasPreviousAddresses: false, previousAddresses: createAddressBook(), drugIssue: '', armedForces: '', professionalSubject: '', health: '', relations: [], incident: { enabled: false, agency: '', agencyDetail: '', agencySubdetail: '', otherAgency: '', type: '', escapeReasons: [], deathReasons: [], escapeDetail: { ...EMPTY_INCIDENT_DETAIL }, deathDetail: { ...EMPTY_INCIDENT_DETAIL } },
});
export const DEFAULT_RELATION: RelationInput = { fullName: '', birthYear: '', gender: 'Nam', identityNumber: '', relation: '', currentAddress: '' };

export const INITIAL_PEOPLE: PersonRecord[] = [
  {
    ...createDefaultPerson(),
    id: 'demo-person-1',
    createdAt: '2026-10-12T08:00:00.000Z',
    role: 'Người làm chứng',
    fullName: 'Nguyễn Văn An',
    gender: 'Nam',
    birthDate: '1990-04-18',
    identityNumber: '001090012345',
    occupation: 'Kinh doanh',
    phone: '0912345678',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Phố Láng Hạ', ward: 'Phường Đống Đa', province: 'Hà Nội', country: 'Việt Nam' },
    },
    relations: [
      {
        id: 'rel-1',
        fullName: 'Nguyễn Thị Hoa',
        birthYear: '1992',
        gender: 'Nữ',
        identityNumber: '001092004567',
        relation: 'Vợ',
        currentAddress: 'Phố Láng Hạ, Đống Đa, Hà Nội',
      },
    ],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-2',
    createdAt: '2026-10-12T08:30:00.000Z',
    role: 'Bị can',
    fullName: 'Trần Thị Mai',
    gender: 'Nữ',
    birthDate: '1988-11-25',
    identityNumber: '079188009876',
    occupation: 'Lao động tự do',
    phone: '0987654321',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Đối tượng sưu tra',
    criminalRecord: 'Tiền án',
    criminalRecordDetails: '1 tiền án về tội Trộm cắp tài sản năm 2018 (đã xóa án tích)',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Nguyễn Trãi', ward: 'Phường Ba Đình', province: 'TP. Hồ Chí Minh', country: 'Việt Nam' },
    },
    relations: [
      {
        id: 'rel-2',
        fullName: 'Trần Văn Hùng',
        birthYear: '1960',
        gender: 'Nam',
        identityNumber: '079060001234',
        relation: 'Bố',
        currentAddress: 'TP. Hồ Chí Minh',
      },
    ],
    incident: {
      enabled: true,
      agency: 'Trại tạm giam',
      agencyDetail: 'Trại tạm giam Chí Hòa',
      agencySubdetail: '',
      otherAgency: '',
      type: 'tron',
      escapeReasons: [
        { id: 'esc-1', name: 'Sơ hở của cán bộ', officerAction: 'Khiển trách ca trực' },
      ],
      deathReasons: [],
      escapeDetail: {
        place: 'Trại tạm giam',
        otherPlace: '',
        eventDate: '2025-05-10',
        recaptureDate: '2025-05-15',
        content: 'Lợi dụng lúc chuyển ca trực đã trèo tường bỏ trốn, bị bắt lại sau 5 ngày tại địa bàn lân cận.',
        outcome: 'Khởi tố vụ án',
        officerOutcome: 'Kỷ luật khiển trách 02 cán bộ quản giáo',
      },
      deathDetail: { ...EMPTY_INCIDENT_DETAIL },
    },
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-3',
    createdAt: '2026-10-12T09:00:00.000Z',
    role: 'Bị hại',
    fullName: 'Lê Hoàng Nam',
    gender: 'Nam',
    birthDate: '1995-07-03',
    identityNumber: '048095006789',
    occupation: 'Công nhân',
    phone: '0905123456',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Lê Duẩn', ward: 'Phường Cầu Giấy', province: 'Đà Nẵng', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-4',
    createdAt: '2026-10-13T08:15:00.000Z',
    role: 'Bị cáo',
    fullName: 'Phạm Minh Tuấn',
    gender: 'Nam',
    birthDate: '1985-09-12',
    identityNumber: '025085001122',
    occupation: 'Kinh doanh',
    phone: '0978112233',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Số 15 Phố Huế', ward: 'Phường Hoàn Kiếm', province: 'Hà Nội', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-5',
    createdAt: '2026-10-13T09:30:00.000Z',
    role: 'Người làm chứng',
    fullName: 'Vũ Thị Hương',
    gender: 'Nữ',
    birthDate: '1992-03-30',
    identityNumber: '031092003344',
    occupation: 'Cán bộ, công chức',
    phone: '0934556677',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Số 88 Lạch Tray', ward: 'Phường Ba Đình', province: 'Hải Phòng', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-6',
    createdAt: '2026-10-14T10:00:00.000Z',
    role: 'Bị can',
    fullName: 'Đặng Quốc Bảo',
    gender: 'Nam',
    birthDate: '1979-12-05',
    identityNumber: '040079005566',
    occupation: 'Lao động tự do',
    phone: '0918778899',
    drugIssue: 'Có sử dụng',
    armedForces: 'Không',
    professionalSubject: 'Đối tượng sưu tra',
    criminalRecord: 'Tiền sự',
    addresses: {
      ...createAddressBook(),
      current: { street: '24 Đường 3/2', ward: 'Phường Thanh Xuân', province: 'Cần Thơ', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-7',
    createdAt: '2026-10-14T11:20:00.000Z',
    role: 'Bị hại',
    fullName: 'Bùi Thị Bích Ngọc',
    gender: 'Nữ',
    birthDate: '1998-08-14',
    identityNumber: '046098007788',
    occupation: 'Học sinh, sinh viên',
    phone: '0962334455',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Khu đô thị An Cựu', ward: 'Phường Đống Đa', province: 'Huế', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-8',
    createdAt: '2026-10-15T08:45:00.000Z',
    role: 'Người có quyền lợi, nghĩa vụ liên quan',
    fullName: 'Hoàng Văn Thái',
    gender: 'Nam',
    birthDate: '1982-01-20',
    identityNumber: '022082009900',
    occupation: 'Công nhân',
    phone: '0983112244',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Hạ Long', ward: 'Xã Đông Anh', province: 'Quảng Ninh', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-9',
    createdAt: '2026-10-15T14:10:00.000Z',
    role: 'Nguyên đơn dân sự',
    fullName: 'Ngô Đức Trọng',
    gender: 'Nam',
    birthDate: '1975-06-17',
    identityNumber: '038075001234',
    occupation: 'Nông dân',
    phone: '0903889900',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Thôn 3 Xã Quảng Xương', ward: 'Xã Sóc Sơn', province: 'Thanh Hóa', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-10',
    createdAt: '2026-10-16T09:05:00.000Z',
    role: 'Bị đơn dân sự',
    fullName: 'Đỗ Thị Thu Thảo',
    gender: 'Nữ',
    birthDate: '1991-10-08',
    identityNumber: '037091004321',
    occupation: 'Kinh doanh',
    phone: '0945667788',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Lê Hồng Phong', ward: 'Phường Hoàn Kiếm', province: 'Nghệ An', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-11',
    createdAt: '2026-10-16T15:30:00.000Z',
    role: 'Người bào chữa',
    fullName: 'Trịnh Công Định',
    gender: 'Nam',
    birthDate: '1986-05-22',
    identityNumber: '068086008765',
    occupation: 'Cán bộ, công chức',
    phone: '0979445566',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Phố Trần Phú', ward: 'Phường Cầu Giấy', province: 'Lâm Đồng', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-12',
    createdAt: '2026-10-17T08:50:00.000Z',
    role: 'Người giám định',
    fullName: 'Lý Thanh Hà',
    gender: 'Nữ',
    birthDate: '1989-02-14',
    identityNumber: '075089006543',
    occupation: 'Cán bộ, công chức',
    phone: '0913223344',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Hùng Vương', ward: 'Phường Ba Đình', province: 'Đồng Nai', country: 'Việt Nam' },
    },
    relations: [],
  },
  {
    ...createDefaultPerson(),
    id: 'demo-person-13',
    createdAt: '2026-10-17T11:40:00.000Z',
    role: 'Người làm chứng',
    fullName: 'Dương Văn Khoa',
    gender: 'Nam',
    birthDate: '2001-11-19',
    identityNumber: '056201009876',
    occupation: 'Học sinh, sinh viên',
    phone: '0981990011',
    drugIssue: 'Không',
    armedForces: 'Không',
    professionalSubject: 'Không',
    addresses: {
      ...createAddressBook(),
      current: { street: 'Đường Trần Phú', ward: 'Phường Cầu Giấy', province: 'Khánh Hòa', country: 'Việt Nam' },
    },
    relations: [],
  },
];
