import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert, Grid } from '@mui/material';
import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';

export const AuthorizationWrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    // const location = useLocation();
    // const user = useSelector((state: RootState) => state.user);

    const getUser = useCallback(async () => {
        if (!checked) {
            try {
                await dispatch(getCurrentUserAction());
            } catch (err) {
            } finally {
                setChecked(true);
            }
        }
    }, [checked, dispatch]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    return (
        !checked ? (
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                <Alert severity="warning">
                    Проверка авторизации...
                </Alert>
            </Grid>
        ) : (
            <>{children}</>
        )
    );

};