import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import type {
    ApiError, LoginInfo, LoginRequest, LogoutInfo, UserCredentials, UserInfo,
} from '~/types';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiSetHeader = (name: string, value: string) => {
    if (api.defaults.headers.common && value) {
        api.defaults.headers.common[name] = value;
    }
};

const apiDeleteHeader = (name: string) => {
    if (api.defaults.headers.common) {
        delete api.defaults.headers.common[name];
    }
};

const getToken = Cookies.get('Authorization');

if (getToken) {
    apiSetHeader('Authorization', `Bearer ${getToken}`);
}

export async function login(credentials: UserCredentials): Promise<LoginInfo> {
    try {
        const { data } = await api.post<LoginRequest, AxiosResponse<LoginInfo>>('/user/login', credentials);

        Cookies.set('Authorization', data.access_token, { expires: 1 });
        apiSetHeader('Authorization', `Bearer ${data.access_token}`);

        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function logout(): Promise<LogoutInfo> {
    try {
        const { data } = await api.get('/user/logout');

        Cookies.remove('Authorization');
        apiDeleteHeader('Authorization');

        return data as LogoutInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function currentUser(): Promise<UserInfo> {
    try {
        const { data } = await api.get('/user/current');

        return data as UserInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
