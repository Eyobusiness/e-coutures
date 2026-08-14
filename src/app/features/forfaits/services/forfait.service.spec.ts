// @vitest-environment jsdom
import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { ForfaitService } from './forfait.service';
import { Forfait, CreateForfaitRequest } from '../models/forfait.model';

describe('ForfaitService', () => {
  let service: ForfaitService;
  let mockHttpClient: any;

  const mockForfait: Forfait = {
    id: 'forfait-123',
    nom: 'Pro',
    prixMensuel: 15000,
    prixAnnuel: 150000,
    nbAteliersMax: 5,
    nbUtilisateursMax: 10,
    nbCommandesMois: 500,
    stockageMo: 5000,
    fonctionnalites: 'Export PDF, Support prioritaire',
    estActif: true
  };

  beforeEach(() => {
    mockHttpClient = {
      get: (url: string) => of({ data: [mockForfait], meta: { total: 1 } }),
      post: (url: string, body: any) => of({ id: 'forfait-123', ...body }),
      put: (url: string, body: any) => of({ id: 'forfait-123', ...body }),
      delete: (url: string) => of(mockForfait)
    };

    const injector = {
      get(token: unknown) {
        if (token === HttpClient) return mockHttpClient;
        return null;
      }
    } as Injector;

    service = runInInjectionContext(injector, () => new ForfaitService());
  });

  it('should fetch forfaits list from GET /api/v1/forfaits/all', async () => {
    const res = await firstValueFrom(service.getAll(1, 10));
    expect(res.data.length).toBe(1);
    expect(res.data[0].nom).toBe('Pro');
  });

  it('should create a new forfait via POST /api/v1/forfaits', async () => {
    const payload: CreateForfaitRequest = {
      nom: 'Enterprise',
      prixMensuel: 50000,
      prixAnnuel: 500000,
      nbAteliersMax: 20,
      nbUtilisateursMax: 50,
      nbCommandesMois: 5000,
      stockageMo: 50000,
      fonctionnalites: 'Accès API, Support dédié',
      estActif: true
    };

    const res = await firstValueFrom(service.create(payload));
    expect(res.nom).toBe('Enterprise');
  });

  it('should delete forfait via DELETE /api/v1/forfaits/{id}', async () => {
    const res = await firstValueFrom(service.delete('forfait-123'));
    expect(res.id).toBe('forfait-123');
  });
});
