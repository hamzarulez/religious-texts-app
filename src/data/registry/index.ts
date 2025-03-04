import { islamicTextsRegistry } from './islamic-texts';
import { christianTextsRegistry } from './christian-texts';
import { judaicTextsRegistry } from './judaic-texts';

export type TextRegistryType = {
  [K: string]: () => Promise<any>;
};

export const textRegistry: TextRegistryType = {
  ...islamicTextsRegistry,
  ...christianTextsRegistry,
  ...judaicTextsRegistry,
};

export const getRegistryByReligion = (religion: string): TextRegistryType => {
  switch (religion.toLowerCase()) {
    case 'islam':
      return islamicTextsRegistry;
    case 'christianity':
      return christianTextsRegistry;
    case 'judaism':
      return judaicTextsRegistry;
    default:
      return {};
  }
};