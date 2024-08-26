import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

interface SelectFieldProps {
  name?: string;
  label?: string;
  value?: string | number;
  onChange?: any;
  onBlur?: any;
  error?: boolean;
  helperText?: any;
  options?: SelectOption[];
};

interface SelectOption {
  value: string | number;
  name: string;
}

export default function SelectField({
  name,
  label,
  value = '',
  onChange,
  onBlur,
  error,
  helperText,
  options
}: SelectFieldProps) {
  return (
    <FormControl style={{paddingBottom: 10}} error={error} fullWidth>
      <InputLabel id="demo-simple-select-required-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={value || ''}
        label={label}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
      >
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {(options || []).map((obj: any) => (
            <MenuItem key={obj.value+""+obj.name} value={obj.value}>{obj.name}</MenuItem>
        ))}
      </Select>
      {error  && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
