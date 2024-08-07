export interface IRequestParams {
  endpoint: string;
  method: 'GET' | 'POST';
  baseUrl?: string;
  query?: { [key: string]: string | number };
  body?: { [key: string]: string | number | boolean };
}

export interface IAPI {
  baseUrl: string;
  request: <T>(params: Omit<IRequestParams, 'baseUrl'>) => Promise<T>;
}

const genericRequest = async <T>({
  endpoint,
  method = 'GET',
  baseUrl = '',
  query,
  body = {},
}: IRequestParams): Promise<T> => {
  const url = new URL(baseUrl + endpoint);

  if (query) {
    Object.entries(query).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }

  const res = await fetch(url, {
    method,
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })
    .then((r) => r.json())
    .then((r: { result: T }) => r.result);
  return res;
};

export const createApi = (baseUrl: string) => ({
  baseUrl,
  request: <T>(params: Omit<IRequestParams, 'baseUrl'>) =>
    genericRequest<T>({ ...params, baseUrl }),
});
