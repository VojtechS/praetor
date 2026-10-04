import { AxiosError } from 'axios';
import type { AxiosAdapter, AxiosResponse } from 'axios';
import { handleMockRequest } from '../../mocks/handlers.ts';

const MOCK_DELAY_MS = 400;

function parseBody(data: unknown): unknown {
  return typeof data === 'string' ? (JSON.parse(data) as unknown) : undefined;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const query = (config.params ?? {}) as Record<string, string | undefined>;
  const result = handleMockRequest(
    (config.method ?? 'get').toLowerCase(),
    config.url ?? '',
    query,
    parseBody(config.data),
  );
  const isError = result.status >= 400;
  const response: AxiosResponse = {
    data: isError ? { message: result.message } : { data: result.data },
    status: result.status,
    statusText: '',
    headers: {},
    config,
  };

  if (isError) {
    const code = result.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
    throw new AxiosError(result.message, code, config, null, response);
  }

  return response;
};
