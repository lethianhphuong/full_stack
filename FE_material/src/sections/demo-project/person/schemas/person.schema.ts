import * as Yup from 'yup';
import type { PersonFormValues, RelationInput } from '../types';

const TODAY = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const optionalText = () => Yup.string().defined();
const optionalIdentity = () => Yup.string().trim().matches(/^$|^(\d{9}|\d{12})$/, 'CCCD/CMT phải gồm 9 hoặc 12 chữ số').defined();
const dateNotFuture = () => Yup.string().test('not-future', 'Ngày không được ở tương lai', (value) => !value || value <= TODAY()).defined();
const address = () => Yup.object({ street: optionalText(), ward: optionalText(), province: optionalText(), country: optionalText() }).defined();
const addressBook = () => Yup.object({ birthPlace: address(), homeTown: address(), permanent: address(), temporary: address(), current: address() }).defined();
const reason = () => Yup.object({ id: Yup.string().required(), name: Yup.string().required(), officerAction: optionalText() }).defined();
const detail = () => Yup.object({
  place: optionalText(), otherPlace: optionalText(), eventDate: dateNotFuture(), recaptureDate: dateNotFuture(), content: optionalText(), outcome: optionalText(), officerOutcome: optionalText(),
}).defined();

export const relationSchema: Yup.ObjectSchema<RelationInput> = Yup.object({
  fullName: Yup.string().trim().required('Vui lòng nhập họ tên').defined(),
  birthYear: Yup.string().matches(/^$|^(19|20)\d{2}$/, 'Năm sinh không hợp lệ').defined(),
  gender: Yup.mixed<RelationInput['gender']>().oneOf(['Nam', 'Nữ', 'Khác']).required('Vui lòng chọn giới tính').defined(),
  identityNumber: optionalIdentity(),
  relation: Yup.string().trim().required('Vui lòng chọn hoặc nhập quan hệ').defined(),
  currentAddress: optionalText(),
});

export const personSchema: Yup.ObjectSchema<PersonFormValues> = Yup.object({
  role: Yup.string().required('Vui lòng chọn vai trò').defined(),
  fullName: Yup.string().trim().required('Vui lòng nhập họ và tên').defined(),
  gender: Yup.mixed<PersonFormValues['gender']>().oneOf(['Nam', 'Nữ', 'Khác']).required('Vui lòng chọn giới tính').defined(),
  birthDate: Yup.string().required('Vui lòng chọn ngày sinh').test('not-future', 'Ngày sinh không được ở tương lai', (value) => !value || value <= TODAY()).defined(),
  identityNumber: optionalIdentity(),
  noIdentityReason: Yup.string().trim().when('identityNumber', { is: (value: string) => !value, then: (schema) => schema.required('Vui lòng nhập lý do không có CCCD/CMT') }).defined(),
  otherName: optionalText(),
  identityIssueDate: dateNotFuture().test('after-birth', 'Ngày cấp không được trước ngày sinh', function (value) { return !value || !this.parent.birthDate || value >= this.parent.birthDate; }),
  identityIssuePlace: optionalText(), ethnicity: optionalText(), nationality: optionalText(), passport: optionalText(),
  passportIssueDate: dateNotFuture().test('after-birth', 'Ngày cấp không được trước ngày sinh', function (value) { return !value || !this.parent.birthDate || value >= this.parent.birthDate; }),
  passportIssuePlace: optionalText(), education: optionalText(),
  occupation: Yup.string().required('Vui lòng chọn nghề nghiệp').defined(), position: optionalText(), workplace: optionalText(),
  phone: Yup.string().trim().matches(/^$|^(0\d{9}|\+84\d{9})$/, 'Số điện thoại không hợp lệ').defined(),
  familyBackground: optionalText(), religion: optionalText(), partyMember: Yup.string().required('Vui lòng chọn').defined(),
  criminalRecord: Yup.string().required('Vui lòng chọn').defined(), criminalRecordDetails: optionalText(),
  addresses: addressBook().test('current-address', 'Vui lòng nhập nơi ở hiện tại', function (value) { return !!value?.current?.street?.trim() || this.createError({ path: 'addresses.current.street', message: 'Vui lòng nhập nơi ở hiện tại' }); }),
  hasPreviousAddresses: Yup.boolean().defined(), previousAddresses: addressBook(),
  drugIssue: Yup.string().required('Vui lòng chọn').defined(), armedForces: Yup.string().required('Vui lòng chọn').defined(), professionalSubject: Yup.string().required('Vui lòng chọn').defined(), health: optionalText(),
  relations: Yup.array().of(relationSchema.concat(Yup.object({ id: Yup.string().required() }))).defined(),
  incident: Yup.object({
    enabled: Yup.boolean().defined(), agency: optionalText(), agencyDetail: optionalText(), agencySubdetail: optionalText(), otherAgency: optionalText(),
    type: Yup.mixed<PersonFormValues['incident']['type']>().oneOf(['', 'tron', 'chet']).defined(),
    escapeReasons: Yup.array().of(reason()).defined(), deathReasons: Yup.array().of(reason()).defined(),
    escapeDetail: detail(), deathDetail: detail(),
  }).defined().test('incident-rules', 'Thông tin trốn/chết chưa hợp lệ', function (value) {
    if (!value?.enabled) return true;
    if (!value.agency) return this.createError({ path: 'incident.agency', message: 'Vui lòng chọn đơn vị' });
    if (value.agency === 'Khác' && !value.otherAgency.trim()) return this.createError({ path: 'incident.otherAgency', message: 'Vui lòng ghi cụ thể đơn vị' });
    if (!value.type) return this.createError({ path: 'incident.type', message: 'Vui lòng chọn trường hợp' });
    const rows = value.type === 'tron' ? value.escapeReasons : value.deathReasons;
    if (!rows.length) return this.createError({ path: `incident.${value.type === 'tron' ? 'escapeReasons' : 'deathReasons'}`, message: 'Vui lòng thêm ít nhất một hình thức/nguyên nhân' });
    const selectedDetail = value.type === 'tron' ? value.escapeDetail : value.deathDetail;
    if (selectedDetail.place === 'Khác' && !selectedDetail.otherPlace.trim()) return this.createError({ path: `incident.${value.type === 'tron' ? 'escapeDetail' : 'deathDetail'}.otherPlace`, message: 'Vui lòng ghi rõ địa điểm' });
    if (value.type === 'tron' && selectedDetail.eventDate && selectedDetail.recaptureDate && selectedDetail.recaptureDate < selectedDetail.eventDate) return this.createError({ path: 'incident.escapeDetail.recaptureDate', message: 'Ngày bắt lại không được trước ngày trốn' });
    return true;
  }),
});
