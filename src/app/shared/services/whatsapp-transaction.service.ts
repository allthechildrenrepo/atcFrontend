import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndPoint } from "./endpoint";
import { HTTPBase } from "./http/httpBase";

@Injectable({
    providedIn: "root"
})

export class WhatsAppTransactionService extends HTTPBase {

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
        return this.endPoint.whatsappTransaction;
    }

}


@Injectable({
    providedIn: "root"
})

export class WhatsAppTransactionServiceV2 extends HTTPBase {

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
        return this.endPoint.whatsappTransactionFetch;
    }

}