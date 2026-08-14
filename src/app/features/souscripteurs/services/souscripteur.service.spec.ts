// @vitest-environment jsdom
import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { SouscripteurService } from './souscripteur.service';

describe('SouscripteurService', () => {
  let service: SouscripteurService;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: (url: string) => of({ data: [], meta: { total: 0 } }),
      post: (url: string, body: any) => of({ id: 's1', ...body }),
      put: (url: string, body: any) => of({ id: 's1', ...body }),
      delete: (url: string) => of(null)
    };

    const injector = {
      get(token: unknown) {
        if (token === HttpClient) return mockHttpClient;
        return null;
      }
    } as Injector;

    service = runInInjectionContext(injector, () => new SouscripteurService());
  });

  it('should call getAll endpoint', async () => {
    const res = await firstValueFrom(service.getAll());
    expect(res).toBeDefined();
  });

  it('should call create endpoint', async () => {
    const payload = {
      nomComplet: 'Jean Test',
      email: 'jean@test.com',
      telephone: '+225070000',
      pays: 'CI',
      devise: 'XOF',
      statut: 'actif'
    };
    const res = await firstValueFrom(service.create(payload));
    expect(res.nomComplet).toBe('Jean Test');
  });
});
