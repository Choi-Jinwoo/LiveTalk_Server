import { isNone } from './none.util';

type IsStringOptions = {
  nullable?: boolean;
}

export const isString = (data: any, options?: IsStringOptions): data is string => {
  if (isNone(data) && options?.nullable === true) {
    return true;
  }

  if (typeof (data) === 'string') {
    return true;
  }

  return false;
}