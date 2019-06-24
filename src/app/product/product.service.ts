import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get<any>(`/api/saturno/product/search`);
  }

  getStockTotal() {
    return this.httpClient.get<any>(`/api/saturno/stock/total`);
  }

  getClients(): Observable<any> {
    return this.httpClient.get<any>('/api/organization/customer/list');
  }
}
