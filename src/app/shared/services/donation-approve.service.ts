import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from "rxjs";
import { GenericServerResponse } from "../model/genericServerResponse";

@Injectable({
  providedIn: "root"
})
export class DonationApproveService extends HTTPBase {
  donationTransactionId:any;
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.donationApprove+this.donationTransactionId+"/";
  }

  set donationId(id) {
    this.donationTransactionId = id;
  }

  get filePayload() {
    return true;
  }
}
