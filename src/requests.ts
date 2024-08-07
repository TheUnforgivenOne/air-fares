export interface IRequestParams {
  endpoint: string;
  method: 'GET' | 'POST';
  baseUrl?: string;
  headers?: { [key: string]: string };
  query?: { [key: string]: string | number };
  body?: { [key: string]: string | number | boolean | object };
}

export interface IAPI {
  baseUrl: string;
  request: <T>(params: Omit<IRequestParams, 'baseUrl'>) => Promise<T>;
}

const genericRequest = async <T>({
  endpoint,
  method = 'GET',
  baseUrl = '',
  headers = {},
  query,
  body = {},
}: IRequestParams): Promise<T> => {
  const url = new URL(baseUrl + endpoint);

  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  const res = await fetch(url, {
    headers,
    method,
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
  // .then((r: { result: T }) => r.result);
  return res as T;
};

export const createApi = (baseUrl: string) => ({
  baseUrl,
  request: <T>(params: Omit<IRequestParams, 'baseUrl'>) => genericRequest<T>({ ...params, baseUrl }),
});
