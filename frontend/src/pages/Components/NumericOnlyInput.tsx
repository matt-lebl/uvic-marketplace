import { FormControl, TextField, FormHelperText } from '@mui/material'

import React, { useState, ChangeEvent } from 'react';

interface props {
  label: string;
  placeholder: string | null;
  errorMsg?: string | undefined;
  onChange: (value: string | null) => void;
}

const NumericInput: React.FC<props> = ({ label, placeholder, errorMsg, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(placeholder);
  const [prevValue, setPrevValue] = useState<string | null>(placeholder);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue || newValue.match(/^\d*\.?\d*$/)) {
      setError(null);
      setValue(newValue)
      setPrevValue(newValue);
      onChange(newValue);
    } else {
      setValue(prevValue);
      setError(errorMsg ?? "Please enter a valid number (int or float)");
    }
  };

  return (
    <FormControl fullWidth>
      <TextField
        type="text"
        name={label.replace('_', ' ')}
        onChange={handleChange}
        value={value}
        label={label}
        placeholder={placeholder ?? ""}
        margin="normal"
        error={Boolean(error)}
      />
      <FormHelperText style={{ color: 'red' }}>
        {error}
      </FormHelperText>
    </FormControl>
  );
}
export default NumericInput;
