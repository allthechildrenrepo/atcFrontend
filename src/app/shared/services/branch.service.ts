import { Injectable } from '@angular/core';
import { HTTPBase } from './http/httpBase';
import { EndPoint } from './endpoint';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Branch } from '../../shared/model/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends HTTPBase {

  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.fetchAllBranch;
  }

  get filePayload() {
    return false;
  }

}
