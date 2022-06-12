import React, { Fragment, useState } from 'react';
import { Form, Formik } from 'formik';
import { Alert, Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { sendProducerInfo } from '~/api';
import { SendProducerInfo } from '~/types';
import { AdditionalInfoForm } from './additional-info-form';
import { MainInfoForm } from './main-info-form';
import { validationSchema } from './validation-schema';

const defaultValues: SendProducerInfo = {
    commodityGroup: [],
    email: '',
    inn: '',
    fileInfo: null,
    name: '',
    region: { id: 77, kladr_id: 7700000000000, name: 'Москва', type: 'г' },
    site: '',
    telephone: '',
};

const steps = ['Основная информация', 'Дополнительная информация'];

const renderStepContent = (disabled: boolean, step: number): JSX.Element => {
    switch (step) {
        case 0:
            return <MainInfoForm isDisabled={disabled} />;
        case 1:
            return <AdditionalInfoForm />;
        default:
            return <div>Not Found</div>;
    }
}

export const ProducerPageComponent = (): JSX.Element => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [moderatorMessage, setModeratorMessage] = useState<string>('');

    async function submitForm(values: SendProducerInfo, actions: any) {
        try {
            await sendProducerInfo(values);
            actions.setSubmitting(false);
            setActiveStep(activeStep + 1);
        } catch (e) {
            console.error(e);
        }
    }

    function onSubmit(values: SendProducerInfo, actions: any) {
        if (activeStep === steps.length - 1) {
            submitForm(values, actions);
        } else {
            setActiveStep(activeStep + 1);
            actions.setTouched({});
            actions.setSubmitting(false);
        }
    }

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            {isApproved && (
                <Alert variant="filled" severity="success" sx={{ marginBottom: 3 }}>
                    Ваша заявка была одобрена!
                </Alert>
            )}
            {moderatorMessage && activeStep < steps.length && (
                <Alert variant="filled" severity="error" sx={{ marginBottom: 3 }}>
                    Ваша заявка была отклонена. Сообщение модератора: {moderatorMessage}
                </Alert>
            )}
            <Stepper activeStep={activeStep} sx={{ margin: '0 auto', width: '75%' }}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Fragment>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" align="center" gutterBottom>
                            Спасибо за Вашу заявку.
                        </Typography>
                        <Typography align="center" variant="subtitle1">
                            Ваша заявка отправлена модератору. Пожалуйста, дождитесь его решения и,
                            если потребуется, обновите её в соответствии с полученным комментарием.
                        </Typography>
                    </>
                ) : (
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={validationSchema[activeStep]}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form id="checkoutForm">
                                {renderStepContent(isApproved, activeStep)}
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                    {activeStep > 0 && (
                                        <Button onClick={() => setActiveStep(activeStep - 1)}>
                                            Назад
                                        </Button>
                                    )}
                                    <Button
                                        disabled={isApproved || isSubmitting}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isSubmitting && <CircularProgress size={24} />}
                                        {activeStep === steps.length - 1 ? 'Отправить' : 'Далее'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                )}
            </Fragment>
        </Grid>
    );
}
