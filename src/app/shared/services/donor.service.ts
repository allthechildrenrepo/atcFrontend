import { Injectable } from '@angular/core';
import { HTTPBase } from './http/httpBase';
import { EndPoint } from './endpoint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class DonorService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.fetchDonorDetatils;
  }

  get filePayload() {
    return false;
  }

  getUserIdParams(data) {
    return { user__id: data };
  }

  getParams(username: any) {
    let params = {
      username: username
    };
    return params;
  }
}
