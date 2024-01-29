import { RenderTypeEnum } from './constants';

export type FormItemType = {
  type: `${RenderTypeEnum}`;
  label: string;
  description?: string;
  required?: boolean;
  value?: any;

  placeholder?: string; // input,textarea

  list?: { label: string; value: any }[]; // select

  maxLen?: number; // input,textarea

  markList?: { label: string; value: any }[]; // slider
  step?: number; // slider
  max?: number; // slider, number input
  min?: number; // slider, number input

  onChange: (val: any) => void;
};
