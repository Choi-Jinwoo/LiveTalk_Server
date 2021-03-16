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