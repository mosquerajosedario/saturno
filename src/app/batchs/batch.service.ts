import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(private httpClient: HttpClient) {}

  get(data: any) {
    return this.httpClient.get<any>(
      `/api/saturno/stock/${data.name}/${data.description}/${data.variety}/${data.colour}`
    );
  }

  identifyByBatch(batch: string): Observable<any> {
    return this.httpClient.get<any>(`/api/saturno/stock/${batch}`);
  }

  getQuantityByBatch(batch: string): Observable<any> {
    return this.httpClient.get<any>(`/api/saturno/stock/${batch}/quantity`);
  }
}
