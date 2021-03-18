import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class TransactionModeService extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return true;
    }


    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.modesOfTransaction;
    }

}