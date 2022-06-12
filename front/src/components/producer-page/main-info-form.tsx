import React from 'react';
import { FieldMetaProps, useField } from 'formik';
import { Autocomplete, FormHelperText, Grid, TextField, Typography } from '@mui/material';
import _regions from '~/assets/regions.json';
import { Region } from '~/types';
import { formModel } from './form-model';

const regions: Region[] = _regions as Region[];

export const MainInfoForm = (): JSX.Element => {
    const [commodityGroupField, commodityGroupMeta] = useField(formModel.commodityGroup.name);
    const [innField, innMeta] = useField(formModel.inn.name);
    const [producerNameField, producerNameMeta] = useField(formModel.producerName.name);
    const [regionField, regionMeta] = useField(formModel.region.name);
    const [siteField, siteMeta] = useField(formModel.site.name);

    const helperText = (meta: FieldMetaProps<any>): string => meta.error && meta.touched ? meta.error : '';

    return (
        <React.Fragment>
            <Typography variant="h6" align="center" py={2}>
                Основная информация
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...producerNameField}
                        error={producerNameMeta.touched && !!producerNameMeta.error}
                        fullWidth
                        helperText={helperText(producerNameMeta)}
                        name={formModel.producerName.name}
                        label={formModel.producerName.label}
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...innField}
                        error={innMeta.touched && !!innMeta.error}
                        fullWidth
                        helperText={helperText(innMeta)}
                        name={formModel.inn.name}
                        label={formModel.inn.label}
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        disabled
                        value={regionField.value}
                        getOptionLabel={option => option.value}
                        options={regions}
                        renderInput={params => (
                            <TextField {...params} label={formModel.region.label} variant="standard" />
                        )}
                    />
                    {regionMeta.touched && regionMeta.error && <FormHelperText>{regionMeta.error}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...commodityGroupField}
                        error={commodityGroupMeta.touched && !!commodityGroupMeta.error}
                        fullWidth
                        helperText={helperText(commodityGroupMeta)}
                        name={formModel.commodityGroup.name}
                        label={formModel.commodityGroup.label}
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...siteField}
                        error={siteMeta.touched && !!siteMeta.error}
                        fullWidth
                        helperText={helperText(siteMeta)}
                        name={formModel.site.name}
                        label={formModel.site.label}
                        type="text"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
