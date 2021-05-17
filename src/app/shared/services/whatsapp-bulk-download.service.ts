import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndPoint } from "./endpoint";
import { HTTPBase } from "./http/httpBase";

@Injectable({
    providedIn: "root"
})

export class WhatsappBulkDownloadService extends HTTPBase {

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
        return this.endPoint.whatsappbulkdownload;
    }

    get endpointsss() {
        return this.endPoint.whatsappbulkdownload;
    }

}


@Injectable({
    providedIn: "root"
})

export class WhatsappDeleteService extends HTTPBase {

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
        return this.endPoint.whatsappdelete;
    }

    get endpointsss() {
        return this.endPoint.whatsappdelete;
    }

}