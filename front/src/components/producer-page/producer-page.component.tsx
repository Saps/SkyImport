import React, { Fragment, useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
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

    async function submitForm(values: any, actions: any) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
        setActiveStep(activeStep + 1);
    }

    function onSubmit(values: any, actions: any) {
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
                            [formModel.region.name]: '',
                            [formModel.commodityGroup.name]: '',
                            [formModel.site.name]: '',
                            [formModel.csvInfo.name]: {},
                        }}
                        validationSchema={currentValidationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form id="checkoutForm">
                                {renderStepContent(activeStep)}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {activeStep > 0 && (
                                        <Button onClick={() => setActiveStep(activeStep - 1)}>
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isSubmitting && <CircularProgress size={24} />}
                                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
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
