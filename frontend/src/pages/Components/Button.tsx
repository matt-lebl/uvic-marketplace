import React, { Component } from 'react';
import ReactButton from '@mui/material/Button'

interface Props {
    id: string,
    label?: string,
  }

export default function Button({label} : Props) {
    return(<ReactButton>{label}</ReactButton>);
}
