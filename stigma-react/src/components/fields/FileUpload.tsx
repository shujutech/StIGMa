import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';

export interface FileUploadProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: string) => void;
}

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FileUpload({ label, field, fqn, disabled, onChange }: FileUploadProps) {
  const encode = field.type === 'base64';
  return (
    <FieldLabel label={label}>
      <input
        type="file"
        className="block text-sm"
        disabled={disabled}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) {
            onChange(fqn, '');
            return;
          }
          if (encode) {
            const b64 = await fileToBase64(file);
            onChange(fqn, b64);
          } else {
            onChange(fqn, file.name);
          }
        }}
      />
    </FieldLabel>
  );
}
