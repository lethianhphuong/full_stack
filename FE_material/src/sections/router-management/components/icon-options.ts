import { ICON_NAMES } from './icon-catalog.generated';

export type IconOption = {
  value: string;
  label: string;
  collection: string;
};

function humanizeIconName(value: string) {
  return (value.split(':')[1] || value)
    .replace(/-(bold-duotone|bold|linear|broken|outline|filled|fill|line)$/, '')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function createIconOption(value: string): IconOption {
  const [collection] = value.split(':');
  return { value, label: humanizeIconName(value), collection };
}

export const ICON_OPTIONS: IconOption[] = ICON_NAMES.map(createIconOption);
