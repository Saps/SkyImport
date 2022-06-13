import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import type {
    ApiError, LoginInfo, LoginRequest, LogoutInfo, ProducerInfo, Region, UserCredentials, UserInfo,
} from '~/types';

import type { FirmsFilterParams, FirmsRequest, FirmView } from '~/types';
import type { CommodityGroup, CommodityGroupParsingState } from '~/types';

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

export async function getFirms(
        type: 'approved' | 'premoderated' = 'approved',
        filterParams: FirmsFilterParams,
        offset: number = 0,
        limit: number = 15,
    ): Promise<FirmView> {
    let url: string = '';

    if (type === 'approved') {
        url = '/firmfil';
    } else if (type === 'premoderated') {
        url = '/firmmod';
    }

    try {
        const { data } = await api.get<FirmsRequest, AxiosResponse<FirmView>>(
            url, { params: { ...filterParams, offset, limit } }
        );

        return data as FirmView;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getRegions(): Promise<Region[]> {
    try {
        const { data } = await api.get<FirmsRequest, AxiosResponse<Region[]>>('/region');

        return data as Region[];
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getGroups(): Promise<CommodityGroup[]> {
    try {
        const { data } = await api.get<{}, AxiosResponse<CommodityGroup[]>>('/pglist');

        return data as CommodityGroup[];
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getGroupsParsingStates(): Promise<CommodityGroupParsingState[]> {
    try {
        const { data } = await api.get<{}, AxiosResponse<CommodityGroupParsingState[]>>('/pglist2');

        return data as CommodityGroupParsingState[];
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function getProducerInfo(): Promise<any> {
    try {
        const { data } = await api.get('/firmone');

        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function sendProducerInfo(values: ProducerInfo): Promise<any> {
    try {
        const { data } = await api.post('/firmone', values);

        return data;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function approveItem(id: number): Promise<boolean> {
    try {
        await api.get('/firmapprove', { params: { id } });

        return true;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function rejectItem(id: number, comment: string): Promise<boolean> {
    try {
        await api.get('/firmreject', { params: { id, comment } });

        return true;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function resetGroup(id: number): Promise<boolean> {
    try {
        await api.get('/pgreset', { params: { id } });

        return true;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}
