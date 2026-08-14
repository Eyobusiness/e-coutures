import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { StatsOverview, StatsPaiements, StatsWorkshops } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService extends BaseApiService {
  private readonly endpoint = '/api/v1/admin/stats';

  getOverview(): Observable<ApiResponse<StatsOverview>> {
    return this.get<StatsOverview>(`${this.endpoint}/overview`);
  }

  getPaiementsStats(from?: string, to?: string): Observable<ApiResponse<StatsPaiements>> {
    const params: Record<string, string> = {};
    if (from) params['from'] = from;
    if (to) params['to'] = to;
    return this.get<StatsPaiements>(`${this.endpoint}/payments`, params);
  }

  getWorkshopsStats(): Observable<ApiResponse<StatsWorkshops>> {
    return this.get<StatsWorkshops>(`${this.endpoint}/workshops`);
  }
}
