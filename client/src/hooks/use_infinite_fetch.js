import React from 'react';

const LIMIT = 10;

/**
 * @template T
 * @typedef {object} ReturnValues
 * @property {Array<T>} data
 * @property {Error | null} error
 * @property {boolean} isLoading
 * @property {() => Promise<void>} fetchMore
 */

/**
 * @template T
 * @param {string} apiPath
 * @param {(apiPath: string) => Promise<T[]>} fetcher
 * @returns {ReturnValues<T>}
 */
export function useInfiniteFetch(apiPath, data = []) {
  const internalRef = React.useRef({ isLoading: false, offset: 0 });

  const [result, setResult] = React.useState({
    data: [],
    error: null,
    isLoading: true,
  });

  const fetchMore = React.useCallback(() => {
    const { offset } = internalRef.current;
    setResult((cur) => ({
      ...cur,
      data: [...cur.data, ...(data?.slice(offset, offset + LIMIT) ?? [])],
      isLoading: false,
    }));
    internalRef.current = {
      offset: offset + LIMIT,
    };
  }, [apiPath, data]);

  React.useEffect(() => {
    setResult(() => ({
      data: [],
      error: null,
      isLoading: true,
    }));
    internalRef.current = {
      isLoading: false,
      offset: 0,
    };

    fetchMore();
  }, [apiPath, data]);
  console.log(result);
  return {
    ...result,
    fetchMore,
  };
}
