// ----------------------------------------------------------------------
// Mock Data for Grid Demo
// ----------------------------------------------------------------------

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  role: string;
  startDate: Date;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
};

const FIRST_NAMES = [
  'Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Thu',
  'Vũ Đức', 'Đặng Quỳnh', 'Bùi Thanh', 'Đỗ Hải', 'Ngô Bảo',
  'Dương Ánh', 'Lý Kim', 'Hồ Quang', 'Phan Như', 'Trịnh Diệu',
  'Mai Hương', 'Võ Tấn', 'Đinh Tuấn', 'Lương Thế', 'Tạ Minh',
];

const LAST_NAMES = [
  'An', 'Bình', 'Cường', 'Dũng', 'Em',
  'Hoa', 'Giang', 'Hùng', 'Khánh', 'Linh',
  'Minh', 'Nam', 'Phương', 'Quân', 'Sơn',
  'Tú', 'Uyên', 'Việt', 'Xuân', 'Yến',
];

const DEPARTMENTS = ['Kỹ thuật', 'Marketing', 'Bán hàng', 'Nhân sự', 'Tài chính', 'Thiết kế', 'Vận hành'];
const ROLES = ['Nhân viên', 'Trưởng nhóm', 'Quản lý', 'Giám đốc', 'Thực tập sinh'];
const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Huế'];
const STATES = ['Miền Bắc', 'Miền Nam', 'Miền Trung'];
const STATUSES: Person['status'][] = ['active', 'inactive', 'pending'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    
    return {
      id: `person-${index + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase().replace(/\s/g, '.')}.${lastName.toLowerCase()}@company.vn`,
      age: Math.floor(Math.random() * 40) + 22,
      salary: Math.floor(Math.random() * 50000000) + 10000000,
      department: randomElement(DEPARTMENTS),
      role: randomElement(ROLES),
      startDate: randomDate(new Date(2018, 0, 1), new Date()),
      status: randomElement(STATUSES),
      avatar: `https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-${(index % 25) + 1}.webp`,
      address: {
        city: randomElement(CITIES),
        state: randomElement(STATES),
        country: 'Việt Nam',
      },
    };
  });
}

// Pre-generated data for demos
export const MOCK_PEOPLE_50 = generateMockPeople(50);
export const MOCK_PEOPLE_100 = generateMockPeople(100);
export const MOCK_PEOPLE_1000 = generateMockPeople(1000);
