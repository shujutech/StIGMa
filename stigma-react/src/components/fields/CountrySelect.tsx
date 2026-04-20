import { ComboBoxField, type ComboBoxFieldProps } from './ComboBoxField';

/**
 * Country combo box. On change, the parent `onChange` is invoked and
 * `FieldsetSection` can cascade (clear child State/City) — we don't need
 * local behaviour beyond the standard combo here.
 */
export function CountrySelect(props: ComboBoxFieldProps) {
  return <ComboBoxField {...props} />;
}
