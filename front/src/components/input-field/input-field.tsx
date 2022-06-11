import React from 'react';
import { useField } from 'formik';
import { at } from 'lodash';
import { TextField } from '@mui/material';

export const InputField = (props: any) => {
  const { errorText, ...rest } = props;
  const [field, meta] = useField(props);

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    return (touched && error) ? error : '';
  }

  return (
    <TextField
      type="text"
      error={meta.touched && meta.error && true}
      helperText={_renderHelperText()}
      {...field}
      {...rest}
    />
  );
}
