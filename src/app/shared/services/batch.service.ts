import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { EndPoint } from "./endpoint";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class BatchService extends HTTPBase {
  batch: any;
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    if(this.batch){
      return this.endPoint.batch + this.batch + "/";

    }
    return this.endPoint.batch;
  }

  get filePayload() {
    return false;
  }

  set batchId(id) {
    this.batch = id;
  }

  getParams(branhId, donationlist) {
    let param = new HttpParams();
    param.append("branch_id", branhId);
    param.append("donation_ids", donationlist);
    return param;
  }
}
