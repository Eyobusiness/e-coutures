import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from '../models/api-response.model';
import { MenuResponse } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseApiService {
  private readonly endpoint = '/api/v1/menus';

  getMenus(): Observable<ApiResponse<MenuResponse[]>> {
    return this.get<MenuResponse[]>(this.endpoint);
  }
}
