import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Utilisateur,
  CreateUtilisateurRequest,
  UpdateUtilisateurRequest
} from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/admins`;

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/all`);
  }

  getById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateUtilisateurRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateUtilisateurRequest): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(`${this.baseUrl}/${id}`);
  }
}
