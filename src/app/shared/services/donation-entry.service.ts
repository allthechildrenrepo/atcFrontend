import { EndPoint } from './endpoint';
import { HTTPBase } from './http/httpBase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

@Injectable({
  providedIn: 'root'
})
export class DonationEntryService extends HTTPBase{

  constructor(public endPoint: EndPoint,public httpClient: HttpClient) {
    super(httpClient);
   }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint(){
    return this.endPoint.submitDonation;
  }

  get filePayload() {
    return true;
  }

}
