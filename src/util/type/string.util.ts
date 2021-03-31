import { isNone } from './none.util';
type IsStringOptions = {
  nullable?: boolean;
} | undefined

export const isString = (data: any, options: IsStringOptions) => {
  if (isNone(data) && options?.nullable === true) {
    return true;
  }

  if (typeof (data) === 'string') {
    return true;
  }

  return false;
}