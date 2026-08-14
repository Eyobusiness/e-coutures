import { describe, it, expect } from 'vitest';
import {
  extractPathWithQuery,
  serializeBody,
  computeSha256Hex,
  computeHmacSha256Base64,
  generateHmacHeaders
} from './hmac.utils';

describe('HMAC Utils', () => {
  it('should extract path with query from full URL', () => {
    const url = 'https://coutureproapi.sds-techs.com/api/v1/auth/admin?ref=123';
    expect(extractPathWithQuery(url)).toBe('/api/v1/auth/admin?ref=123');
  });

  it('should extract path from relative URL', () => {
    const url = '/api/v1/subscribers';
    expect(extractPathWithQuery(url)).toBe('/api/v1/subscribers');
  });

  it('should serialize body correctly', () => {
    expect(serializeBody(null)).toBe('');
    expect(serializeBody(undefined)).toBe('');
    expect(serializeBody('hello')).toBe('hello');
    expect(serializeBody({ email: 'test@example.com' })).toBe('{"email":"test@example.com"}');
  });

  it('should compute SHA256 hex of empty string', async () => {
    const hash = await computeSha256Hex('');
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should generate HMAC headers with X-EC-Timestamp and X-EC-Signature', async () => {
    const secret = 'ecouture-dev-hmac-secret-change-me';
    const timestamp = '1770727200';
    const headers = await generateHmacHeaders(
      'POST',
      'https://coutureproapi.sds-techs.com/api/v1/auth/admin',
      { email: 'admin@digit.local', password: '123' },
      secret,
      timestamp
    );

    expect(headers['X-EC-Timestamp']).toBe(timestamp);
    expect(headers['X-EC-Signature']).toBeTruthy();
    expect(typeof headers['X-EC-Signature']).toBe('string');
  });
});
