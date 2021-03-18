import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndPoint } from "../endpoint";
import { HTTPBase } from "../http/httpBase";

@Injectable({
  providedIn: "root"
})
export class LeadRequestService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }
  leadId: number;

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.leadId ? this.endPoint.raiseLeadRequest + this.leadId + "/" : this.endPoint.raiseLeadRequest;
  }

  get filePayload() {
    return false;
  }
  /**
   * 
   * @param branhId no_of_leads: int Eg 12
      branch: branch id
      status: REQUESTED = 0
   * @param donationlist 
   */
  getParams(noOfLeads, branchId) {
    let prams = {
      'no_of_leads': noOfLeads,
      'branch': branchId,
      'status': '0'
    }
    return prams;
  }

  /**
  * 
  * @param branhId no_of_leads: int Eg 12
     branch: branch id
     status: REQUESTED = 0
  * @param donationlist 
  */
  getPendingRequest(branchId, status = 0) {
    let params = { 'status': status }
    if (branchId) {
      params['branch'] = branchId;
    }
    return params;
  }
}