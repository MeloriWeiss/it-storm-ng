import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticlePreviewType} from "../../../types/article-preview.type";
import {ArticlesType} from "../../../types/articles.type";
import {CategoriesType} from "../../../types/categories.type";
import {ArticleType} from "../../../types/acticle.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getPopularArticles(): Observable<ArticlePreviewType[]> {
    return this.http.get<ArticlePreviewType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<ArticlePreviewType[]> {
    return this.http.get<ArticlePreviewType[]>(environment.api + 'articles/related/' + url);
  }

  getArticles(page: number, categories: CategoriesType[]): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: { page, categories }
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }
}
