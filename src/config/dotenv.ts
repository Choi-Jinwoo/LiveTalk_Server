import 'dotenv/config';

const getValue = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    const errMessage = `${key} environment must be defined`;

    throw new Error(errMessage);
  }

  return value;
};

export const PORT = getValue('PORT');

export const MYSQL = {
  HOST: getValue('MYSQL_HOST'),
  PORT: Number(getValue('MYSQL_PORT')),
  USERNAME: getValue('MYSQL_USERNAME'),
  PASSWORD: getValue('MYSQL_PASSWORD'),
  DATABASE: getValue('MYSQL_DATABASE'),
  SYNC: getValue('MYSQL_SYNC') === 'true',
}

export const REDIS = {
  HOST: getValue('REDIS_HOST'),
  PORT: Number(getValue('REDIS_PORT')),
}

export const JWT = {
  EXPIRES_IN: getValue('JWT_EXPIRES_IN'),
  ISSUER: getValue('JWT_ISSUER'),
  SECRET: getValue('JWT_SECRET'),
  SUBJECT: getValue('JWT_SUBJECT'),
}