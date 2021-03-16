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