import { Grid, TextField } from '@mui/material';
import React from 'react';

interface ImageUploadMUProps {
    name?: string;
    label?: string;
    value?: any;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    helperText?: any;
}

export default function ImageUploadMU({
name,
label,
value,
onChange,
onBlur,
error,
helperText,
}: ImageUploadMUProps) {
  return (
    <TextField
      style={{paddingBottom: 10}}
      name={name}
      hiddenLabel
      label={label}
      type={'file'}
      variant="outlined"
      fullWidth
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
    />
  );
}
