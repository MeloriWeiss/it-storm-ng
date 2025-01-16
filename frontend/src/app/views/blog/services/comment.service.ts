import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentsType} from "../../../../types/comments.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {MyCommentType} from "../../../../types/my-comment.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";
import {AppliedCommentActionType} from "../../../../types/applied-comment-action.type";

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(offset: number, articleUrl: string): Observable<CommentsType | DefaultResponseType> {
    return this.http.get<CommentsType | DefaultResponseType>(environment.api + 'comments', {
      params: {offset, article: articleUrl}
    });
  }

  addComment(myComment: MyCommentType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', myComment);
  }

  applyCommentAction(action: CommentActionsType, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/${commentId}/apply-action`, {action});
  }

  getArticleCommentActions(articleId: string): Observable<AppliedCommentActionType[] | DefaultResponseType> {
    return this.http.get<AppliedCommentActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: {articleId}
    });
  }
}
