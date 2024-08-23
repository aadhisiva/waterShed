import { Grid, TextField } from '@mui/material';
import React from 'react';

interface TextFieldProps {
    name?: string;
    type?: string;
    label?: string;
    value?: any;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    disabled?: boolean;
    helperText?: any;
}

export default function TextFieldMU({
name,
type,
label,
value,
onChange,
onBlur,
error,
helperText,
disabled
}: TextFieldProps) {
  return (
    <TextField
      style={{paddingBottom: 10}}
      name={name}
      label={label}
      type={type ? type : 'text'}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      disabled={disabled}
      helperText={helperText}
    />
  );
}
