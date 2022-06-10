import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, Checkbox, CircularProgress, Container,
    FormControlLabel, Grid, Step, StepLabel, Stepper, TextField,
} from '@mui/material';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { mixed, number, object } from 'yup';

interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
    label: string;
}

function FormikStep({ children }: FormikStepProps) {
    return <>{children}</>;
}

function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
    const [completed, setCompleted] = useState(false);
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];

    return (
        <Container maxWidth={false}>
            <Formik
                {...props}
                validationSchema={currentChild.props.validationSchema}
                onSubmit={async (values, helpers) => {
                    if (step < childrenArray.length - 1) {
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
                            {childrenArray.map((child, index) => (
                                <Step key={child.props.label} completed={step > index || completed}>
                                    <StepLabel>{child.props.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {currentChild}

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
                                    {isSubmitting ? 'Submitting' : step < childrenArray.length - 1 ? 'Next' : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}

export const MainComponent = (): JSX.Element => {
    return (
        <Card>
            <CardContent>
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
                    <FormikStep label="Personal Data">
                        <Box paddingBottom={2}>
                            <Field component={TextField} fullWidth name="firstName" label="First Name" />
                        </Box>
                        <Box paddingBottom={2}>
                            <Field component={TextField} fullWidth name="lastName" label="Last Name" />
                        </Box>
                        <Box paddingBottom={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="millionaire"
                                        value="millionaire"
                                    />
                                }
                                label="I am a millionaire"/>
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
                    <FormikStep label="More Info">
                        <Box paddingBottom={2}>
                            <Field fullWidth name="description" component={TextField} label="Description" />
                        </Box>
                    </FormikStep>
                </FormikStepper>
            </CardContent>
        </Card>
    );
}
