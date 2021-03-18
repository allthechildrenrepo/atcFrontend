import { EndPoint } from './endpoint';
import { HTTPBase } from './http/httpBase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class TelecallerService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.createTeleCaller;
  }

  get filePayload() {
    return false;
  }
}

@Injectable({
  providedIn: "root"
})
export class TelecallerFetchService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.fetchTeleCaller;
  }

  get filePayload() {
    return false;
  }

  getParams(data) {
    return { user_profile__branch: data };
  }

  getUserName(data) {
    return { username: data};
  }
}

@Injectable({
  providedIn: "root"
})
export class TelecallerStatsFetchService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.teleCallerStat;
  }

  get filePayload() {
    return false;
  }

  getParams(data) {
    return {
      user_profile__branch: data.branchId,
      start_date: data.fromDate,
      end_date: data.toDate
    };
  }
}
