export interface RequestError {
    statusCode: number;
    message: string;
}

export interface Response<T> {
    response?: T;
    error?: RequestError;
}

export interface RefreshTokenRequestOptions {
    refreshToken: string;
}

export interface RefreshTokenResponseData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
