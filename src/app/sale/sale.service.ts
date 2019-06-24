import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private httpClient: HttpClient) { }

  create(data) {
    const body = data;

    return this.httpClient.post<any>(`/api/saturno/sale`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`/api/saturno/sale/${id}`);
  }

  get() {
    return this.httpClient.get<any>(`/api/saturno/product/search`);
  }

  getClients(): Observable<any> {
    return this.httpClient.get<any>('/api/organization/customer/list');
  }

  identifyById(id) {
    return this.httpClient.get<any>(`/api/saturno/sale/${id}`);
  }

  setPaymentMethod(id, data) {
    const body = data;

    return this.httpClient.patch(`/api/saturno/sale/${id}/payment_method`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }

  addItem(id, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };
    return this.httpClient.patch<any>(`/api/saturno/sale/${id}/item/add`, data, httpOptions);
  }

  removeItem(id, batch) {
    const body = '';

    return this.httpClient.patch(`/api/saturno/sale/${id}/item/${batch}/remove`,
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }

  updateItemQuantity(id, batch, data) {
    const body = data;

    return this.httpClient.patch(`/api/saturno/sale/${id}/item/${batch}/quantity/${data}`,
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }

  updateItemPrice(id, batch, data) {
    const body = data;

    return this.httpClient.patch(`/api/saturno/sale/${id}/item/${batch}/price/${data}`,
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }

  isClosable(id) {
    return this.httpClient.get<any>(`/api/saturno/sale/${id}/closable`);
  }

  close(id) {
    const body = '';

    return this.httpClient.patch(`/api/saturno/sale/${id}/close`,
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/plain'),
      },
    );
  }
}
