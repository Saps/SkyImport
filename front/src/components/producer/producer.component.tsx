import React, { useState } from 'react';
import {
    Box, Button, CircularProgress, Grid, Step, StepLabel, Stepper, TextField,
} from '@mui/material';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { mixed, number, object } from 'yup';

interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
    label: string;
}

const FormikStep = ({ children }: FormikStepProps) => <>{children}</>;

function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
    const array = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
    const [completed, setCompleted] = useState(false);
    const [step, setStep] = useState(0);

    return (
        <Formik
            {...props}
            validationSchema={array[step].props.validationSchema}
            onSubmit={async (values, helpers) => {
                if (step < array.length - 1) {
                    setStep((s) => s + 1);
                    helpers.setTouched({});
                } else {
                    await props.onSubmit(values, helpers);
                    setCompleted(true);
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form autoComplete="off">
                    <Stepper alternativeLabel activeStep={step}>
                        {array.map((child, index) => (
                            <Step key={child.props.label} completed={step > index || completed}>
                                <StepLabel>{child.props.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {array[step]}

                    <Grid container spacing={2}>
                        {step > 0 ? (
                            <Grid item>
                                <Button
                                    disabled={isSubmitting}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setStep((s) => s - 1)}
                                >
                                    Back
                                </Button>
                            </Grid>
                        ) : null}
                        <Grid item>
                            <Button
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {isSubmitting ? 'Submitting' : step < array.length - 1 ? 'Next' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}


export const ProducerComponent = (): JSX.Element => {
    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            <FormikStepper
                initialValues={{
                    firstName: '',
                    lastName: '',
                    millionaire: false,
                    money: 0,
                    description: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((acc) => setTimeout(acc, 3000));
                    console.log('values', values);
                }}
            >
                <FormikStep label="Персональные данные">
                    <Box paddingBottom={2}>
                        <Field component={TextField} fullWidth name="firstName" label="First Name" />
                    </Box>
                    <Box paddingBottom={2}>
                        <Field component={TextField} fullWidth name="lastName" label="Last Name" />
                    </Box>
                    <Box paddingBottom={2}>
                        <Field component={TextField} fullWidth name="lastName" label="Last Name" />
                    </Box>
                    <Box paddingBottom={2}>
                        <Field component={TextField} fullWidth name="lastName" label="Last Name" />
                    </Box>
                    <Box paddingBottom={2}>
                        <Field component={TextField} fullWidth name="lastName" label="Last Name" />
                    </Box>
                </FormikStep>
                <FormikStep
                    label="Bank Accounts"
                    validationSchema={object({
                        money: mixed().when('millionaire', {
                            is: true,
                            then: number()
                                .required()
                                .min(
                                    1_000_000,
                                    'Because you said you are a millionaire you need to have 1 million'
                                ),
                            otherwise: number().required(),
                        }),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field
                            fullWidth
                            name="money"
                            type="number"
                            component={TextField}
                            label="All the money I have"
                        />
                    </Box>
                </FormikStep>
            </FormikStepper>
        </Grid>
    );
}
