import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../../model";

export abstract class HTTPBase {
  constructor(public httpClient: HttpClient) {}

  // HTTP endpoint to hit and its meta
  abstract get isAuthenticatedEndpoint(): boolean;
  // url to hit
  abstract get endpoint(): string;

  abstract get filePayload(): boolean;

  /**
   * Default headers for all endpoint
   */
  get header() {
    let headers = {
      "Content-type": "application/json",
      Accept: "application/json"
    };
    if (this.filePayload) {
      let head = new HttpHeaders();
      // head.set('content-type','multipart/form-data')
      if (this.isAuthenticatedEndpoint) {
        head = head.set("Authorization", `Token ${this.token}`);
      }
      return head;
    }
    if (this.isAuthenticatedEndpoint) {
      headers["Authorization"] = `Token ${this.token}`;
    }
    return headers;
  }

  /**
   * Return the token from the local storage
   */
  get token() {
    const authToken = localStorage.getItem("token");
    return authToken;
  }

  /**
   * @httpParams - httpParam
   * Append the header with the get request in httpclient
   */
  get(httpParams?): Observable<any> {
    if (httpParams) {
      return this.httpClient.get(this.endpoint, {
        headers: this.header,
        params: httpParams
      });
    }
    return this.httpClient.get(this.endpoint, { headers: this.header });
  }


  /**
   * @httpParams - httpParam
   * Append the header with the get request in httpclient
   */
   getwithURL(url,httpParams?): Observable<any> {
    if (httpParams) {
      return this.httpClient.get(url, {
        headers: this.header,
        params: httpParams
      });
    }
    return this.httpClient.get(url, { headers: this.header });
  }

  /**
   * @param data  - body to post
   * Appends header to the post request in http Client
   * returns observeral of respoense
   */
  post(data, httpParams?): Observable<any> {

    if (httpParams) {
      return this.httpClient.post(this.endpoint, data, {
        headers: this.header,
        params: httpParams
      });
    }
    return this.httpClient.post(this.endpoint, data, {
      headers: this.header
    });
  }

  postFormData(formData: FormData): Observable<any> {
    return this.httpClient.post(this.endpoint, formData, {
      headers: this.header
    });
  }

  postMultiPardData(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Token ${this.token}`);
    return this.httpClient.post(this.endpoint, formData, {
      headers: headers
    });
  }

  put(data,httpParams?):Observable<any>{
    let head = new HttpHeaders();
    if (this.isAuthenticatedEndpoint) {
      head = head.set("Authorization", `Token ${this.token}`);
    }
    return this.httpClient.put(this.endpoint, data, {
      headers: head
    });
  }

  putWithEndpoint(data,endpoint?, httpParams?):Observable<any>{
    let head = new HttpHeaders();
    if (this.isAuthenticatedEndpoint) {
      head = head.set("Authorization", `Token ${this.token}`);
    }
    return this.httpClient.put(endpoint, data, {
      headers: head
    });
  }
}
