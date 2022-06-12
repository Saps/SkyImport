import React, { useEffect, useState } from 'react';
import { FieldMetaProps, useField } from 'formik';
import { Autocomplete, FormHelperText, Grid, TextField, Typography } from '@mui/material';
import { getGroups, getRegions } from '~/api';
import { LoadingOverlay } from '~/components/loading-overlay/loading-overlay.component';
import { CommodityGroup, Region } from '~/types';
import { formModel } from './form-model';

export const MainInfoForm = (): JSX.Element => {
    const [commodityGroupField, commodityGroupMeta] = useField(formModel.commodityGroup.name);
    const [emailField, emailMeta] = useField(formModel.email.name);
    const [groups, setGroups] = useState<CommodityGroup[]>([]);
    const [innField, innMeta] = useField(formModel.inn.name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [producerNameField, producerNameMeta] = useField(formModel.producerName.name);
    const [regions, setRegions] = useState<Region[]>([]);
    const [regionField, regionMeta] = useField(formModel.region.name);
    const [siteField, siteMeta] = useField(formModel.site.name);
    const [telephoneField, telephoneMeta] = useField(formModel.telephone.name);

    const helperText = (meta: FieldMetaProps<any>): string => meta.error && meta.touched ? meta.error : '';

    async function loadInfo () {
        setIsLoading(true);

        try {
            const [groups, regions] = await Promise.all([getGroups(), getRegions()]);
            setGroups(groups);
            setRegions(regions);
        } catch (e) {
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadInfo();
    }, []);

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
                        getOptionLabel={option => option.name}
                        options={regions}
                        renderInput={params => (
                            <TextField {...params} label={formModel.region.label} variant="standard" />
                        )}
                    />
                    {regionMeta.touched && regionMeta.error && <FormHelperText>{regionMeta.error}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        value={commodityGroupField.value}
                        getOptionLabel={option => option ? `${option.tov_class}: ${option.tov_group}` : ''}
                        options={groups}
                        renderInput={params => (
                            <TextField {...params} label={formModel.commodityGroup.label} variant="standard" />
                        )}
                    />
                    {
                        commodityGroupMeta.touched && commodityGroupMeta.error &&
                        <FormHelperText>{commodityGroupMeta.error}</FormHelperText>
                    }
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...emailField}
                        error={emailMeta.touched && !!emailMeta.error}
                        fullWidth
                        helperText={helperText(emailMeta)}
                        name={formModel.email.name}
                        label={formModel.email.label}
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...telephoneField}
                        error={telephoneMeta.touched && !!telephoneMeta.error}
                        fullWidth
                        helperText={helperText(telephoneMeta)}
                        name={formModel.telephone.name}
                        label={formModel.telephone.label}
                        type="text"
                    />
                </Grid>
            </Grid>
            {isLoading && <LoadingOverlay/>}
        </React.Fragment>
    );
}
