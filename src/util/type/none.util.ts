export const isNone = (data: any): boolean => {
  if (data === null || data === undefined) {
    return true;
  }

  return false;
}