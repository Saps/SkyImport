import React, { useEffect, useState } from 'react';
import { Field, useField } from 'formik';
import { Grid, FormHelperText } from '@mui/material';
import { formModel } from './form-model';

const UploadField = ({ field, isError, label, name, ...props }: any): JSX.Element => {
    return (
        <Field
            variant="outlined"
            name="uploader"
            title={label}
            type="file"
            style={{ display: 'flex', color: isError ? 'red' : 'rgba(0, 0, 0, 0.54)' }}
            {...props}
        />
    );
};

export const AdditionalInfoForm = (): JSX.Element => {
    const [field, { touched, error }, { setValue }] = useField(formModel.fileInfo.name);
    const isError = touched && error && true;
    const [file, setFile] = useState(field.value);
    const [fileName, setFileName] = useState('');
    const [src, setSrc] = useState(field.value);

    const onChange = (e: Event) => {
        const reader = new FileReader();
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            reader.onloadend = () => setFileName(file.name);
            if (file.name !== fileName) {
                reader.readAsDataURL(file);
                setFile(file);
                setSrc(reader);
            }
        }
    };

    useEffect(() => {
        if (file && fileName && src) {
            setValue({ name: fileName, result: src.result });
        }
    }, [file, fileName, src]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <label style={{ color: `${isError ? 'red' : 'rgba(0, 0, 0, 0.54)'}` }}>
                    {formModel.fileInfo.label}
                </label>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '1.2em' }}>
                    <Field
                        variant="outlined"
                        field={field}
                        component={UploadField}
                        onChange={onChange}
                        isError={isError}
                    />
                    {isError && <FormHelperText color="red">{error}</FormHelperText>}
                </div>
            </Grid>
        </Grid>
    );
};
