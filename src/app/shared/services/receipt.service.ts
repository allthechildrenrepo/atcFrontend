import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from "rxjs";
// import { Telecaller } from '../../shared/model/telecaller';


@Injectable({
    providedIn: "root"
})

export class ReceiptSendMailService extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return true;
    }

    get endpoint() {
        return this.endPoint.sendRecipt;
    }


  get filePayload() {
    return true;
  }

}
