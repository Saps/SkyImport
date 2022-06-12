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

export interface FirmView {
    count: number;
    items: Firm[];
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

export interface ProducerInfo {
    commodityGroup: CommodityGroup[];
    email: string;
    inn: string;
    region: Region;
    site: string;
    telephone: string;
}

export interface SendProducerInfo extends ProducerInfo {
    fileInfo: { name: string; result: string; } | null;
}

export interface Region {
    id: number;
    kladr_id: number;
    name: string;
    type: string;
}

export interface CommodityGroup {
    id: number;
    tov_class: string;
    tov_group: string;
}
