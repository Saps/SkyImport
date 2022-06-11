import React from 'react';
import { useField } from 'formik';
import { at } from 'lodash';
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

export const CheckboxField = (props: any) => {
  const { label, ...rest } = props;
  const [field, meta, helper] = useField(props);

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    return error && touched ? <FormHelperText>{error}</FormHelperText> : <></>;
  }

  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.checked}
        checked={field.checked}
        control={<Checkbox {...field} onChange={e => helper.setValue(e.target.checked)} />}
        label={label}
      />
      {_renderHelperText()}
    </FormControl>
  );
}
