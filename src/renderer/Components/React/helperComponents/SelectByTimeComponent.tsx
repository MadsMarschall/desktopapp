import { DateTimePicker } from '@mui/x-date-pickers';
import { Button } from 'react-bootstrap';
import React from 'react';
import { type } from 'os';

export default function SelectByTimeComponent(props: { value: Date, onChange: (newValue) => void, renderInput: (params) => JSX.Element, value1: Date, onChange1: (newValue) => void, onClick: () => Promise<void>, entriesLoaded: number }) {
  return <>
    <div>
      <DateTimePicker
        label='Upper Bound'
        value={props.value}
        onChange={props.onChange}
        ampm={false}
        renderInput={props.renderInput}
      />
      <br />
      <br />
      <DateTimePicker
        label='Lower Bound'
        value={props.value1}
        onChange={props.onChange1}
        ampm={false}
        renderInput={props.renderInput}
      />
    </div>
    <Button
      type='submit'
      className='w-100 mb-2'
      onClick={props.onClick}
    >
      Get Data
    </Button>
    <br />
    <p>Entries loaded: {props.entriesLoaded}</p>
  </>;
}
