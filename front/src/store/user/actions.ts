import { PayloadAction } from '@reduxjs/toolkit';
import { login, logout, currentUser } from '~/api';
import { initialState } from '~/store/user/reducer';
import { AppDispatch } from '~/store/store';
import type { UserCredentials, UserInfo } from '~/types';

export const CURRENT_USER = 'CURRENT_USER';

export const getCurrentUserAction = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const userInfo: UserInfo = await currentUser();
            return dispatch(currentUserAction({ ...userInfo }));
        } catch (error) {
            throw new Error('User is unauthorized');
        }
    };
}

export const loginAction = (credentials: UserCredentials) => {
    return async (dispatch: AppDispatch) => {
        await login(credentials);
        const userInfo: UserInfo = await currentUser();
        return dispatch(currentUserAction({ ...userInfo }));
    };
}

export const logoutAction = () => {
    return async (dispatch: AppDispatch) => {
        await logout();
        return dispatch(currentUserAction({ ...initialState }));
    };
}

export const currentUserAction = (info: UserInfo): PayloadAction<UserInfo> => ({
    type: CURRENT_USER,
    payload: info,
});
