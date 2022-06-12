export interface UserCredentials {
    username: string;
    password: string;
}

export interface UserInfo {
    email: string;
    id: number;
    params: null;
    username: string;
    role: string;
}

export interface LoginInfo {
    access_token: string;
    user_role: string;
}

export interface LogoutInfo {
    ok: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface ApiError {
    error: boolean;
    message: string;
}

export interface CommonResponse {
    message: string;
}

export interface Firm {
    id: string;
    inn: string;
    name: string;
    full_name: string;
    site: string;
}

export interface FirmsFilterParams {
    name?: string;
    inn?: string;
    region?: number;
    categories?: number[];
}

export interface FirmsRequest extends FirmsFilterParams {
    offset: number;
    limit: number;
}

export interface Region {
    id: number;
    name: string;
}
