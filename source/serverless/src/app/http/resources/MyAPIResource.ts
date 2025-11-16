import { Response } from 'express';

// Helper code for the API consumer to understand the error and handle is accordingly
enum StatusCode {
    SUCCESS = '10000',
    FAILURE = '10001',
    RETRY = '10002',
    INVALID_ACCESS_TOKEN = '10003',
}

enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    TOOMANY = 429,
    INTERNAL_ERROR = 500,
}

/**
 * https://github.com/janishar/nodejs-backend-architecture-typescript/blob/master/src/core/ApiResponse.ts パクった
 * 共通的なAPIリソース
 * TODO: 今後改良
 */
abstract class ApiResponse {
    constructor(
        protected statusCode: StatusCode, // 成功 or エラーの詳細コード
        protected status: ResponseStatus, // HTTPレスポンス ステータス
        protected message: string, // 成功 or エラーメッセージ
        protected data?: unknown, // レスポンスボディの中に data: { レスポンスボディの内容 }を含める
        protected metadata?: { [key: string]: unknown }  // レスポンスボディの中に metadata: { その他付与した情報 }を含める
    ) {}

    protected prepare<T extends ApiResponse>(
        res: Response,
        response: T,
        headers: { [key: string]: string },
    ): Response {
        for (const [key, value] of Object.entries(headers))
            res.append(key, value);
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }

    public send(
        res: Response,
        headers: { [key: string]: string } = {},
    ): Response {
        return this.prepare<ApiResponse>(res, this, headers);
    }

    private static sanitize<T extends ApiResponse>(response: T): T {
        const clone: T = {} as T;
        Object.assign(clone, response);
        // @ts-ignore
        delete clone.status;
        for (const i in clone)
            if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}

export class AuthFailureResponse extends ApiResponse {
    constructor(message = 'Authentication Failure', data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message, data, metadata);
    }
}

export class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found', data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message, data, metadata);
    }

    send(res: Response, headers: { [key: string]: string } = {}): Response {
        return super.prepare<NotFoundResponse>(res, this, headers);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden', data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message, data, metadata);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters', data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message, data, metadata);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error', data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message, data, metadata);
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}

export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
    }
}


export class ConflictResponse extends ApiResponse {
    constructor(message: string, data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.CONFLICT, message, data, metadata);
    }
}
export class TooManyRequestsResponse extends ApiResponse {
    constructor(message: string, data?: unknown, metadata?: Record<string, unknown>) {
        super(StatusCode.FAILURE, ResponseStatus.TOOMANY, message, data, metadata);
    }
}

export class SuccessResponse<T> extends ApiResponse {
    constructor(message: string, data: T, metadata?: Record<string, unknown>) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message, data, metadata);
    }
// TODO: いる？
    // send(res: Response, headers: { [key: string]: string } = {}): Response {
    //     return super.prepare<SuccessResponse<T>>(res, this, headers);
    // }
}
// TODO: 使わない奴 消す
export class AccessTokenErrorResponse extends ApiResponse {
    private instruction = 'refresh_token';

    constructor(message = 'Access token invalid', data?: unknown, metadata?: Record<string, unknown>) {
        super(
            StatusCode.INVALID_ACCESS_TOKEN,
            ResponseStatus.UNAUTHORIZED,
            message,
            data,
            metadata
        );
    }

    send(res: Response, headers: { [key: string]: string } = {}): Response {
        headers.instruction = this.instruction;
        return super.prepare<AccessTokenErrorResponse>(res, this, headers);
    }
}

export class TokenRefreshResponse extends ApiResponse {
    constructor(
        message: string,
        private accessToken: string,
        private refreshToken: string,
        data: unknown,
        metadata?: Record<string, unknown>
    ) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message, data, metadata);
    }

    send(res: Response, headers: { [key: string]: string } = {}): Response {
        return super.prepare<TokenRefreshResponse>(res, this, headers);
    }
}
