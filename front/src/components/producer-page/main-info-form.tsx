import React from 'react';
import { Grid, Typography } from '@mui/material';
import { InputField } from '~/components';
import { formModel } from './form-model';

export const MainInfoForm = (): JSX.Element => {
    return (
        <React.Fragment>
            <Typography variant="h6" align="center" py={2}>
                Основная информация
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InputField name={formModel.producerName.name} label={formModel.producerName.label} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField name={formModel.inn.name} label={formModel.inn.label} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField name={formModel.region.name} label={formModel.region.label} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField name={formModel.commodityGroup.name} label={formModel.commodityGroup.label} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField name={formModel.site.name} label={formModel.site.label} fullWidth />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
