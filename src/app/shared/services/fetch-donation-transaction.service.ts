import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from "rxjs";
import { GenericServerResponse } from "../model/genericServerResponse";
import { DonationTransaction } from "../model/donation-transaction";

@Injectable({
  providedIn: "root"
})
export class FetchDonationTransactionService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.fetchDonationTransaction;
  }

  get filePayload() {
    return false;
  }

  get model() {
    return DonationTransaction;
  }

  getParams(username: any) {
    let params = {
      username: username
    };
    return params;
  }
}
