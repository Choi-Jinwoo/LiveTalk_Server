type BuilderType<T> = {
  [k in keyof T]: (arg: T[k]) => BuilderType<T>
} & {
  build: () => T
}

export const Builder = <T>(): BuilderType<T> => {
  const data: T = {} as T;

  const builder: any = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'build') {
          return () => data;
        }

        return (value: any) => {
          data[prop as keyof T] = value;

          return builder;
        }
      }
    }
  );

  return builder;
}
