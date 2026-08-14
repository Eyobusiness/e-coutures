// @vitest-environment jsdom
import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { AbonnementService } from './abonnement.service';

describe('AbonnementService', () => {
  let service: AbonnementService;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      get: (url: string) => of({ data: [], meta: { total: 0 } }),
      post: (url: string, body: any) => of({ id: 'a1', ...body }),
      put: (url: string, body: any) => of({ id: 'a1', ...body }),
      delete: (url: string) => of(null)
    };

    const injector = {
      get(token: unknown) {
        if (token === HttpClient) return mockHttpClient;
        return null;
      }
    } as Injector;

    service = runInInjectionContext(injector, () => new AbonnementService());
  });

  it('should call getAll endpoint', async () => {
    const res = await firstValueFrom(service.getAll());
    expect(res).toBeDefined();
  });

  it('should call create endpoint', async () => {
    const payload = {
      souscripteurId: 's1',
      forfaitId: 'f1',
      statut: 'en_essai',
      dateDebut: '2026-08-11',
      dateFin: '2026-09-11',
      renouvellementAuto: true,
      periode: 'mensuel'
    };
    const res = await firstValueFrom(service.create(payload));
    expect(res.souscripteurId).toBe('s1');
  });

  it('should call getBySouscripteur endpoint', async () => {
    mockHttpClient.get = (url: string) => of([{ id: 'a1', souscripteurId: 's1' }]);
    const res = await firstValueFrom(service.getBySouscripteur('s1'));
    expect(res.length).toBe(1);
    expect(res[0].souscripteurId).toBe('s1');
  });
});
