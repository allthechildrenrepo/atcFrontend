import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class FetchWassanggerDevice extends HTTPBase {

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
        return this.endPoint.wassanggerDeviceList;
    }

}

@Injectable({
    providedIn: "root"
})
export class FetchWassanggerFiles extends HTTPBase {

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
        return this.endPoint.filesInWassangger;
    }

}

@Injectable({
    providedIn: "root"
})
export class PromotionImageService extends HTTPBase {
    imageId = '5f8d1d8e42c8c0987a692c7d';

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
        return this.endPoint.promotionImage + this.imageId + "/download";
    }

    get(): Observable<any> {
        // if (httpParams) {
        //   return this.httpClient.get(this.endpoint, {
        //     headers: this.header,
        //     params: httpParams
        //   });
        // }
        let head = this.header;
        // head.append('Access-Control-Allow-Origin', '*');
        head['Access-Control-Allow-Origin'] = '*';
        head['Access-Control-Allow-Credentials'] = 'true';
        // head.append('Access-Control-Allow-Credentials', 'true');
        head["Authorization"] = "Token 6e55a57bd3aa31d9de34642acbc618df3fa16209f8f23a04eb9f38afdcea094e2bc34d256fbb4b7e";
        return this.httpClient.get(this.endpoint, { headers: head });
      }
}