import type { StigmaField } from '../types/stigma';
import { TextInput } from './fields/TextInput';
import { DatePickerField } from './fields/DatePickerField';
import { RichTextField } from './fields/RichTextField';
import { TelephoneInput } from './fields/TelephoneInput';
import { MobilePhoneInput } from './fields/MobilePhoneInput';
import { MoneyInput } from './fields/MoneyInput';
import { CheckboxField } from './fields/CheckboxField';
import { ComboBoxField } from './fields/ComboBoxField';
import { CountrySelect } from './fields/CountrySelect';
import { StateSelect } from './fields/StateSelect';
import { CitySelect } from './fields/CitySelect';
import { FileUpload } from './fields/FileUpload';

export interface FieldRendererProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: unknown) => void;
}

export function FieldRenderer(props: FieldRendererProps) {
  const { field } = props;
  const base = {
    label: props.label,
    field,
    fqn: props.fqn,
    disabled: props.disabled,
    onChange: (fqn: string, v: unknown) => props.onChange(fqn, v),
  };
  switch (field.type) {
    case 'date':
      return <DatePickerField {...base} showTime={false} />;
    case 'datetime':
      return <DatePickerField {...base} showTime />;
    case 'html':
      return <RichTextField {...base} />;
    case 'telephone':
      return <TelephoneInput {...base} />;
    case 'mobilephone':
      return <MobilePhoneInput {...base} />;
    case 'money':
      return <MoneyInput {...base} />;
    case 'boolean':
      return <CheckboxField {...base} />;
    case 'country':
      return <CountrySelect {...base} />;
    case 'state':
      return <StateSelect {...base} />;
    case 'city':
      return <CitySelect {...base} />;
    case 'base64':
    case 'upload':
      return <FileUpload {...base} />;
    default:
      if (field.lookup) return <ComboBoxField {...base} />;
      return <TextInput {...base} />;
  }
}
