import React, { Fragment, useEffect, useState } from 'react';
import { FieldMetaProps, useField } from 'formik';
import {
    Box, Checkbox, Chip, FormControl, FormHelperText, Grid, InputLabel,
    ListItemText, MenuItem, Select, TextField, Typography,
} from '@mui/material';
import { getGroups, getRegions } from '~/api';
import { LoadingOverlay } from '~/components';
import { CommodityGroup, Region } from '~/types';
import { formModel } from './form-model';

interface MainInfoProps {
    isDisabled: boolean;
}

export const MainInfoForm = ({ isDisabled }: MainInfoProps): JSX.Element => {
    const [commodityGroupField, commodityGroupMeta, commodityGroupHelper] = useField(formModel.commodityGroup.name);
    const [emailField, emailMeta] = useField(formModel.email.name);
    const [groups, setGroups] = useState<CommodityGroup[]>([]);
    const [innField, innMeta] = useField(formModel.inn.name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [producerNameField, producerNameMeta] = useField(formModel.producerName.name);
    const [regions, setRegions] = useState<Region[]>([]);
    const [regionField, regionMeta, regionHelper] = useField(formModel.region.name);
    const [siteField, siteMeta] = useField(formModel.site.name);
    const [telephoneField, telephoneMeta] = useField(formModel.telephone.name);

    const groupToString = (value: number): string => {
        const option = groups.find(({ id }) => id === value);
        return option?.tov_class + ': ' + option?.tov_group;
    };

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
        <Fragment>
            <Typography variant="h6" align="center" py={2}>
                Основная информация
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...producerNameField}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
                        error={innMeta.touched && !!innMeta.error}
                        fullWidth
                        helperText={helperText(innMeta)}
                        name={formModel.inn.name}
                        label={formModel.inn.label}
                        type="text"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl disabled error={!!regionMeta.error} fullWidth variant="outlined">
                        <InputLabel>{formModel.region.label}</InputLabel>
                        <Select
                            disabled
                            fullWidth
                            label={formModel.region.label}
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                            name={regionField.name}
                            onChange={event => {
                                const region = regions.find(({ id }) => id === event.target.value) ?? null;
                                regionHelper.setValue(region);
                            }}
                            required
                            value={regionField.value.id}
                        >
                            {regions.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name} {item.type}
                                </MenuItem>
                            ))}
                        </Select>
                        {regionMeta.error && <FormHelperText>{regionMeta.error}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl disabled={isDisabled} error={!!commodityGroupMeta.error} fullWidth variant="outlined">
                        <InputLabel>{formModel.commodityGroup.label}</InputLabel>
                        <Select
                            disabled={isDisabled}
                            fullWidth
                            label={formModel.commodityGroup.label}
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                            multiple
                            name={commodityGroupField.name}
                            onChange={event => {
                                const result = groups.filter(({ id }) => event.target.value.includes(id));
                                commodityGroupHelper.setValue(result);
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value: number) => <Chip key={value} label={groupToString(value)} />)}
                                </Box>
                            )}
                            required
                            value={commodityGroupField.value.map((group: CommodityGroup) => group.id)}
                        >
                            {groups.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    <Checkbox checked={commodityGroupField.value.some((item: CommodityGroup) => item.id === option.id)} />
                                    <ListItemText primary={option.tov_class + ': ' + option.tov_group} />
                                </MenuItem>
                            ))}
                        </Select>
                        {commodityGroupMeta.error && <FormHelperText>{commodityGroupMeta.error}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        {...siteField}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                        disabled={isDisabled}
                        error={telephoneMeta.touched && !!telephoneMeta.error}
                        fullWidth
                        helperText={helperText(telephoneMeta)}
                        name={formModel.telephone.name}
                        label={formModel.telephone.label}
                        type="text"
                    />
                </Grid>
            </Grid>
            {!isDisabled && isLoading && <LoadingOverlay/>}
        </Fragment>
    );
}
