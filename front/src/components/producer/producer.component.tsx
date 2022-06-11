import React, { Fragment, useState } from 'react';
import { Button, CircularProgress, Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { makeStyles } from '@mui/styles';
import { AddressForm } from './address.form';
import { checkoutFormModel } from './checkout-form-model';
import { PaymentForm } from './payment-form';
import { validationSchema } from './validation-schema';

const steps = ['Shipping address', 'Payment details'];

const useStyles = makeStyles(theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1)
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative'
    },
}));

const renderStepContent = (step: number) => {
    switch (step) {
        case 0:
            return <AddressForm formField={checkoutFormModel} />;
        case 1:
            return <PaymentForm formField={checkoutFormModel} />;
        default:
            return <div>Not Found</div>;
    }
}

export const ProducerComponent = (): JSX.Element => {
    const [activeStep, setActiveStep] = useState(0);
    const classes = useStyles();
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
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
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
                            [checkoutFormModel.firstName.name]: '',
                            [checkoutFormModel.lastName.name]: '',
                            [checkoutFormModel.address1.name]: '',
                            [checkoutFormModel.zipcode.name]: '',
                            [checkoutFormModel.useAddressForPaymentDetails.name]: false,
                            [checkoutFormModel.nameOnCard.name]: '',
                            [checkoutFormModel.cardNumber.name]: '',
                            [checkoutFormModel.cvv.name]: '',
                        }}
                        validationSchema={currentValidationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form id="checkoutForm">
                                {renderStepContent(activeStep)}
                                <div className={classes.buttons}>
                                    {activeStep > 0 && (
                                        <Button onClick={() => setActiveStep(activeStep - 1)} className={classes.button}>
                                            Back
                                        </Button>
                                    )}
                                    <div className={classes.wrapper}>
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            {isSubmitting && <CircularProgress size={24} />}
                                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                        </Button>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </Fragment>
        </Grid>
    );
}
