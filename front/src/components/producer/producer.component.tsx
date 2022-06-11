import React, { Fragment, useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { formModel } from './form-model';
import { MainInfoForm } from './main-info-form';
import { PaymentForm } from './payment-form';
import { validationSchema } from './validation-schema';

const steps = ['Shipping address', 'Payment details'];

const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
        case 0:
            return <MainInfoForm />;
        case 1:
            return <PaymentForm />;
        default:
            return <div>Not Found</div>;
    }
}

export const ProducerComponent = (): JSX.Element => {
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
            <Stepper activeStep={activeStep}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Fragment>
                {activeStep === steps.length ? (
                    <Fragment>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                            Your order number is #2001539. We have emailed your order confirmation,
                            and will send you an update when your order has shipped.
                        </Typography>
                    </Fragment>
                ) : (
                    <Formik
                        initialValues={{
                            [formModel.producerName.name]: '',
                            [formModel.inn.name]: '',
                            [formModel.region.name]: '',
                            [formModel.commodityGroup.name]: '',
                            [formModel.site.name]: '',
                            [formModel.nameOnCard.name]: '',
                            [formModel.cardNumber.name]: '',
                            [formModel.cvv.name]: '',
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
