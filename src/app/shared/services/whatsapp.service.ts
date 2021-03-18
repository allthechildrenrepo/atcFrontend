import { HttpClient, HttpParams } from "@angular/common/http";

import { EndPoint } from "./endpoint";
import { HTTPBase } from "./http/httpBase";
//chatAPI
// https://app.chat-api.com/testing
import { Injectable } from "@angular/core";
import { of } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class whatsAppSendFileService extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.whatsappSendFile;
    }

}

@Injectable({
    providedIn: "root"
})

export class whatsAppGetStatus extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.whatsappStatus;
    }

}

@Injectable({
    providedIn: "root"
})

export class whatsAppGetQR extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.whatsappQRCode;
    }

}


@Injectable({
    providedIn: "root"
})

export class whatsAppLogout extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.whatsappLogout;
    }

}



@Injectable({
    providedIn: "root"
})

export class WhatsAppCheckNumber extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.whatsappNumberCheck;
    }

}



@Injectable({
    providedIn: "root"
})

export class WhatsAppSendPickupSendMessage extends HTTPBase {

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return false;
    }

    get filePayload() {
        return false;
    }

    get endpoint() {
        return this.endPoint.pickUpWhatsAppSendMessage;
    }

}