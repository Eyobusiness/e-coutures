export function extractPathWithQuery(urlWithParams: string): string {
  try {
    const urlObj = new URL(urlWithParams);
    return urlObj.pathname + urlObj.search;
  } catch {
    if (urlWithParams.startsWith('/')) {
      return urlWithParams;
    }
    const urlObj = new URL(urlWithParams, 'http://localhost');
    return urlObj.pathname + urlObj.search;
  }
}

export function serializeBody(body: unknown): string {
  if (body === null || body === undefined) {
    return '';
  }
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body === 'object') {
    return JSON.stringify(body);
  }
  return String(body);
}

export async function computeSha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeHmacSha256Base64(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const payloadData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, payloadData);
  const signatureBytes = new Uint8Array(signatureBuffer);

  let binary = '';
  for (let i = 0; i < signatureBytes.length; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  return btoa(binary);
}

export async function generateHmacHeaders(
  method: string,
  urlWithParams: string,
  body: unknown,
  secret: string,
  timestamp: string
): Promise<Record<string, string>> {
  const upperMethod = method.toUpperCase();
  const pathWithQuery = extractPathWithQuery(urlWithParams);
  const bodyString = serializeBody(body);
  const bodyHashHex = await computeSha256Hex(bodyString);

  const payload = `${upperMethod}\n${pathWithQuery}\n${timestamp}\n${bodyHashHex}`;
  const signature = await computeHmacSha256Base64(secret, payload);

  return {
    'X-EC-Timestamp': timestamp,
    'X-EC-Signature': signature
  };
}
