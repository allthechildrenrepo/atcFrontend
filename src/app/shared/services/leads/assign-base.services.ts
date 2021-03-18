import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndPoint } from "../endpoint";
import { HTTPBase } from "../http/httpBase";

@Injectable({
  providedIn: "root"
})
export class AssignBaseService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.LeadBulkUpdate;
  }

  get filePayload() {
    return false;
  }
}