import React from 'react';
import { Grid, Typography } from '@mui/material';
import { CheckboxField } from '../checkbox-field/checkbox-field';
import { InputField } from '../input-field/input-field';

export const AddressForm = ({ formField }: any) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField name={formField.firstName.name} label={formField.firstName.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField name={formField.lastName.name} label={formField.lastName.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <InputField name={formField.address1.name} label={formField.address1.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField name={formField.zipcode.name} label={formField.zipcode.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <CheckboxField
            name={formField.useAddressForPaymentDetails.name}
            label={formField.useAddressForPaymentDetails.label}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
