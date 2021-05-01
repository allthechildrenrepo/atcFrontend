import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndPoint } from "../endpoint";
import { HTTPBase } from "../http/httpBase";

@Injectable({
  providedIn: "root"
})
export class LeadUpdateService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.updateTelecallerToLead;
  }

  get filePayload() {
    return false;
  }
  /**
   * 
   * @param sheet that uplaoded
   */
  getParams(sheet) {
    const params = new FormData();
    params.append("upload_base",  sheet, sheet.name);
    return params;
  }
}


@Injectable({
  providedIn: "root"
})
export class ReceiptBulkUpdateService extends HTTPBase {
  constructor(public endPoint: EndPoint, public httpClient: HttpClient) {
    super(httpClient);
  }

  get isAuthenticatedEndpoint() {
    return true;
  }

  get endpoint() {
    return this.endPoint.uploadBulkReciptXls;
  }

  get filePayload() {
    return false;
  }
  /**
   * 
   * @param sheet that uplaoded
   */
  getParams(sheet, selectedBranch:number=null) {
    const params = new FormData();
    params.append("upload_receipt",  sheet, sheet.name);
    if(selectedBranch) params.append("branch_id", selectedBranch.toString())
    return params;
  }
}