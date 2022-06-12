import React from 'react';
<<<<<<< HEAD
import { at } from 'lodash';
import { useField } from 'formik';
=======
import { useField } from 'formik';
import { at } from 'lodash';
>>>>>>> origin/main
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

export const CheckboxField = (props: any) => {
  const { label, ...rest } = props;
  const [field, meta, helper] = useField(props);

<<<<<<< HEAD
  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    return error && touched ? <FormHelperText>{error}</FormHelperText> : <></>;
  }
=======
  const helperText = (): JSX.Element => {
    const [touched, error] = at(meta, 'touched', 'error');
    return error && touched ? <FormHelperText>{error}</FormHelperText> : <></>;
  };
>>>>>>> origin/main

  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.checked}
        checked={field.checked}
        control={<Checkbox {...field} onChange={e => helper.setValue(e.target.checked)} />}
        label={label}
      />
<<<<<<< HEAD
      {_renderHelperText()}
=======
      {helperText()}
>>>>>>> origin/main
    </FormControl>
  );
}
