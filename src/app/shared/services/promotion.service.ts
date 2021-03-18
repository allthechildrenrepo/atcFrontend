import { Injectable } from "@angular/core";
import { HTTPBase } from "./http/httpBase";
import { HttpParams, HttpClient } from "@angular/common/http";
import { EndPoint } from "./endpoint";
import { of } from "rxjs";
// import { Telecaller } from '../../shared/model/telecaller';


@Injectable({
    providedIn: "root"
})

export class PromotionService extends HTTPBase {

    promotionId: any;

    constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
        super(httpClient);
    }

    get isAuthenticatedEndpoint() {
        return true;
    }

    get endpoint() {
        if (this.promotionId) {
            return this.endPoint.promotion + this.promotionId + '/';
        }
        else {
            return this.endPoint.promotion;
        }
    }


    get filePayload() {
        return true;
    }

}
