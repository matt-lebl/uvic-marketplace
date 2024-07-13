import { FormControl, TextField, FormHelperText } from '@mui/material'

import React, { useState, ChangeEvent } from 'react';

interface props {
  label: string;
  placeholder?: string | undefined;
  errorMsg?: string | undefined;
  onChange: (value: string | undefined) => void;
  onError?: (value: boolean) => void;
}

const NumericInput: React.FC<props> = ({ label, placeholder, errorMsg, onChange, onError }) => {
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<string | undefined>(placeholder);
  //const [prevValue, setPrevValue] = useState<string | undefined>(placeholder);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue || newValue.match(/^\d*\.?\d*$/)) {
      if (onError && error !== undefined) {
        onError && onError(false);
      }
      setError(undefined);
      setValue(newValue)
      //setPrevValue(newValue);
      onChange(newValue);
    } else {
      if (onError && error === undefined) {
        onError && onError(true);
      }
      //setValue(prevValue);
      setError(errorMsg ?? "Please enter a valid number (int or float)");
    }
  };

  return (
    <FormControl fullWidth>
      <TextField
        type="text"
        name={label.replace('_', ' ')}
        data-testid={label + "-numeric-input"}
        id={label + "-numeric-input"}
        onChange={handleChange}
        value={value}
        label={label}
        placeholder={placeholder ?? ""}
        margin="normal"
        error={Boolean(error ?? false)}
      />
      <FormHelperText style={{ color: 'red' }}>
        {error}
      </FormHelperText>
    </FormControl>
  );
}
export default NumericInput;
