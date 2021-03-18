import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class LoginServiceService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return false;
  }

  get endpoint() {
    return this.endPoint.login;
  }

  getFormData(userName, password): FormData {
    const param = new FormData();
    param.append("phone", userName);
    param.append("password", password);
    return param;
  }


  get filePayload() {
    return false;
  }

  
  getParams(userName, password) { 
    const param = {
      "phone":userName,
      "password": password
    }
    return param;

  }
}
