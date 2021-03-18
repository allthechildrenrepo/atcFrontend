import { Injectable } from "@angular/core";
import { HTTPBase } from "../http/httpBase";
import { EndPoint } from "../endpoint";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class LeadFetchService extends HTTPBase {
  leadId: number;

  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    // return this.endPoint.Leadrequest;
    return this.leadId ? this.endPoint.Leadrequest + this.leadId + "/" : this.endPoint.Leadrequest;

  }

  get filePayload() {
    return false;
  }

 /**
   * 
   * @param branhId no_of_leads: int Eg 12
      branchId: branch id
      status: REQUESTED = 0
   */
  fetchAllLeads(branchId){
    let param = {
        "branch":branchId
    }
    return param;
  }

 /**
   * 
   * @param branhId no_of_leads: int Eg 12
      branch: branch id
      status: REQUESTED = 0
   * @param donationlist 
   */
  fetchRequestedLeads(branchId, status) {
    let param = {
        "branch":branchId,
        "status":'0'
    }
    return param;
  }
}