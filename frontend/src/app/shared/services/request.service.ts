import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RequestDataType} from "../../../types/request-data.type";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable()
export class RequestService {

  constructor(private http: HttpClient) { }

  createRequest(requestData: RequestDataType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', requestData);
  }
}
