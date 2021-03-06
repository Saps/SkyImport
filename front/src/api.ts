import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import type {
    ApiError, CommodityGroup, CommodityGroupParsingState, GetProducerInfo, FirmView, FirmsFilterParams,
    FirmsRequest, LoginInfo, LoginRequest, LogoutInfo, Region, SendProducerInfo, UserCredentials, UserInfo,
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

export async function getFirms(
    type: 'approved' | 'premoderated' = 'approved',
    filterParams: FirmsFilterParams,
    offset: number = 0,
    limit: number = 15,
): Promise<FirmView> {
    try {
        const url = type === 'approved' ? '/firmfil' : '/firmmod';
        const { data } = await api.get<FirmsRequest, AxiosResponse<FirmView>>(url, { params: { ...filterParams, offset, limit } });

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

export async function getProducerInfo(): Promise<GetProducerInfo> {
    try {
        const { data } = await api.get('/firmone');

        return data as GetProducerInfo;
    } catch (e) {
        throw new Error((e as AxiosError<ApiError>)?.response?.data.message);
    }
}

export async function sendProducerInfo(values: SendProducerInfo): Promise<any> {
    try {
        const { data } = await api.post('/firmone', values);

        return data as SendProducerInfo;
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

export async function rejectItem(id: number, reason: string): Promise<boolean> {
    try {
        await api.get('/firmreject', { params: { id, reason } });

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
