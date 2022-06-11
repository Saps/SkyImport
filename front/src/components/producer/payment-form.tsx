import React from 'react';
import { Grid, Typography } from '@mui/material';
import { InputField } from '~/components';
import { formModel } from './form-model';

export const PaymentForm = (): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="h6" align="center" py={2}>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputField
            name={formModel.nameOnCard.name}
            label={formModel.nameOnCard.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputField
            name={formModel.cardNumber.name}
            label={formModel.cardNumber.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputField name={formModel.cvv.name} label={formModel.cvv.label} fullWidth />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
