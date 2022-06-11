import React from 'react';
import { Grid, Typography } from '@mui/material';
import { InputField } from '~/components';
import { formModel } from './form-model';

export const AdditionalInfoForm = (): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="h6" align="center" py={2}>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputField name={formModel.csvInfo.name} label={formModel.csvInfo.label} fullWidth />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
