import React, { Fragment, useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { sendProducerInfo } from '~/api';
import { SendProducerInfo } from '~/types';
import { AdditionalInfoForm } from './additional-info-form';
import { formModel } from './form-model';
import { MainInfoForm } from './main-info-form';
import { validationSchema } from './validation-schema';

const steps = ['Основная информация', 'Дополнительная информация'];

const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
        case 0:
            return <MainInfoForm />;
        case 1:
            return <AdditionalInfoForm />;
        default:
            return <div>Not Found</div>;
    }
}

export const ProducerPageComponent = (): JSX.Element => {
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = validationSchema[activeStep];

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
                        initialValues={{
                            [formModel.producerName.name]: '',
                            [formModel.inn.name]: '',
                            [formModel.region.name]: { id: 77, kladr_id: 7700000000000, name: 'Москва', type: 'г' },
                            [formModel.commodityGroup.name]: [],
                            [formModel.site.name]: '',
                            [formModel.email.name]: '',
                            [formModel.telephone.name]: '',
                            [formModel.fileInfo.name]: null,
                        } as unknown as SendProducerInfo}
                        validationSchema={currentValidationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form id="checkoutForm">
                                {renderStepContent(activeStep)}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {activeStep > 0 && (
                                        <Button onClick={() => setActiveStep(activeStep - 1)}>
                                            Назад
                                        </Button>
                                    )}
                                    <Button
                                        disabled={isSubmitting}
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
