import { gzip } from 'pako';

/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  const result = await fetch(url, {
    method: 'GET',
  });
  if (!result.ok) {
    throw new Error('Error!');
  }
  return await result.arrayBuffer();
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJSON(url) {
  const result = await fetch(url, {
    responseType: 'json',
    method: 'GET',
  });
  if (!result.ok) {
    throw new Error('Error!');
  }
  const data = result.json();
  return data;
}

/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const result = await fetch(url, {
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error('Error!');
  }
  return await result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const compressed = gzip(uint8Array);

  const result = await fetch(url, {
    body: compressed,
    headers: {
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error('Error!');
  }
  return result.json();
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
