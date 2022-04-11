'use strict';

const errorName = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  SERVER_ERROR: 'SERVER_ERROR',
  SAVE_COUCH_ERROR: 'SAVE_COUCH_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  TOKEN_ERROR: 'TOKEN_ERROR',

  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SMS_ERROR: 'SMS_ERROR',
  SFTP_ERROR: 'SFTP_ERROR'
};

const errorType = {
  [errorName.USER_ALREADY_EXISTS]: {
    message: 'User is already exists.',
    statusCode: 403,
  },
  [errorName.SERVER_ERROR]: {
    message: 'Server error.',
    statusCode: 500
  },
  [errorName.SAVE_COUCH_ERROR]: {
    // eslint-disable-next-line max-len
    message: 'CouchDB  - помилка запису документа. Спробуйте ще раз, або зверніться у техпідтримку.',
    statusCode: 500
  },
  [errorName.AUTH_ERROR]: {
    message: 'Необхідна авторизація',
    statusCode: 401
  },
  [errorName.TOKEN_ERROR]: {
    message: 'Неправильний або заблокований токен',
    statusCode: 401
  },

  [errorName.UNKNOWN_ERROR]: {
    message: 'Якась помилка',
    statusCode: 303,
  },
  [errorName.VALIDATION_ERROR]: {
    message: 'Validation error',
    statusCode: 400,
  },
  [errorName.SMS_ERROR]: {
    statusCode: 500,
    message: 'sending SMS error',
  },
  [errorName.SFTP_ERROR]: {
    statusCode: 500,
    message: 'SFTP error',
  }
};

const getErrorCode = name => (
  errorType[name] || errorType[name.UNKNOWN_ERROR]
);

const errors = {
  UNKNOWN: {
    code: 'UNKNOWN_ERROR',
    message: 'Unknown error',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal error',
  },
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
  },
  WRONG_EDRPOU: {
    code: 'WRONG_EDRPOU',
    message: 'Wrong partners edrpou',
  },
  PAYMENT_METHON_NOT_AVAILABLE: {
    code: 'PAYMENT_METHON_NOT_AVAILABLE',
    message: 'Payment method not available for this organization',
  },
  SMS_ERROR: {
    code: 'SMS_ERROR',
    message: 'sending SMS error',
  },
  SFTP_ERROR: {
    code: 'SFTP_ERROR',
    message: 'SFTP error',
  }
};

class ErrorWithCode extends Error {
  constructor(error, description) {
    super(error.message);
    this.name = this.constructor.name;
    this.code = error.code ?? errors.UNKNOWN.code;
    this.description = description;
  }

  static codify(originalError, error = errors.UNKNOWN) {
    return originalError instanceof ErrorWithCode ?
      originalError : new ErrorWithCode(error);
  }

  toObject() {
    return {
      code: this.code,
      message: this.message,
      description: this.description,
    };
  }
}


module.exports = {
  errorName,
  errorType,
  getErrorCode,
  ErrorWithCode,
  errors,
};
