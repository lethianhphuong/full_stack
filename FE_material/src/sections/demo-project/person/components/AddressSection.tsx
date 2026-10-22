import Stack from '@mui/material/Stack';
import { AddressSection as SharedAddressSection, BaseSelect, BaseTextField } from '@/components';
import { DRUG_OPTIONS, FORCE_OPTIONS, SUBJECT_OPTIONS } from '../constants';

export default function AddressSection() {
  return (
    <SharedAddressSection
      namePrefix="addresses"
      previousNamePrefix="previousAddresses"
      hasPreviousSwitchName="hasPreviousAddresses"
      showPreviousSwitch
      showCopyButton
      sideFields={
        <Stack spacing={2.5}>
          <BaseSelect name="drugIssue" label="Tệ nạn ma túy *" options={DRUG_OPTIONS} />
          <BaseSelect name="armedForces" label="Lực lượng vũ trang *" options={FORCE_OPTIONS} />
          <BaseSelect name="professionalSubject" label="Đối tượng nghiệp vụ *" options={SUBJECT_OPTIONS} />
          <BaseTextField name="health" label="Tình trạng sức khỏe" />
        </Stack>
      }
    />
  );
}

