import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {FilterItemType} from "../../../../types/filter-item.type";

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<FilterItemType[]> {
    return this.http.get<FilterItemType[]>(environment.api + 'categories');
  }
}
