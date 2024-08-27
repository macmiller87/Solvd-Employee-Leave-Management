export class AppError {
    
    _message;
    _statusCode;

    constructor(message, statusCode) {
        this._message = message;
        this._statusCode = statusCode;
    }

    get message() {
        return this._message;
    }

    set message(message) {
        this._message = message;
    }

    get statusCode() {
        return this._statusCode;
    }

    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }

}