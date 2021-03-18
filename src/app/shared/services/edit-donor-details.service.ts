import { HTTPBase } from "./http/httpBase";
import { Injectable } from '@angular/core';
import { EndPoint } from "./endpoint";
import { HttpClient } from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class EditDonorDetailsService extends HTTPBase{

  donor_id: any;

  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.editDonor+this.donor_id+"/";
  }

  get filePayload() {
    return true;
  }

  set donorId(id) {
    this.donor_id = id;
  }

}
