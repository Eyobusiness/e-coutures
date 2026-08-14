// @vitest-environment jsdom
import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { FactureAbonnementService } from './facture-abonnement.service';

describe('FactureAbonnementService', () => {
  let service: FactureAbonnementService;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: (url: string) => of({ data: [], meta: { total: 0 } }),
      post: (url: string, body: any) => of({ id: 'f1', ...body }),
      put: (url: string, body: any) => of({ id: 'f1', ...body }),
      delete: (url: string) => of({ id: 'f1' })
    };

    const injector = {
      get(token: unknown) {
        if (token === HttpClient) return mockHttpClient;
        return null;
      }
    } as Injector;

    service = runInInjectionContext(injector, () => new FactureAbonnementService());
  });

  it('should call getAll endpoint', async () => {
    const res = await firstValueFrom(service.getAll());
    expect(res).toBeDefined();
  });

  it('should call payer endpoint', async () => {
    const res = await firstValueFrom(service.payer('f1', { moyenPaiement: 'Wave', refTransaction: 'REF123' }));
    expect(res.moyenPaiement).toBe('Wave');
  });

  it('should call getByAbonnement endpoint', async () => {
    mockHttpClient.get = (url: string) => of([{ id: 'f1', abonnementId: 'ab1' }]);
    const res = await firstValueFrom(service.getByAbonnement('ab1'));
    expect(res.length).toBe(1);
  });
});
