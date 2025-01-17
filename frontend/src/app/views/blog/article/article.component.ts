import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/acticle.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticlePreviewType} from "../../../../types/article-preview.type";
import {CommentsType} from "../../../../types/comments.type";
import {CommentType} from "../../../../types/comment.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth.service";
import {CommentActionsType} from "../../../../types/comment-actions.type";
import {AppliedCommentActionType} from "../../../../types/applied-comment-action.type";
import {AppliedActionsUtil} from "../../../shared/utils/applied-actions.util";
import {CommentService} from "../services/comment.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: ArticleType | null = null;
  relatedArticles: ArticlePreviewType[] = [];
  comments: CommentType[] = [];
  commentsCount: number = 0;
  commentsCountLoaded: number = 3;
  myCommentText: string = '';
  commentsInLoad: boolean = false;
  appliedCommentActions: AppliedCommentActionType[] = [];
  isLogged: boolean = false;
  commentActions = CommentActionsType;
  environmentUrl: string = environment.url;

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const articleUrl = params['url'];
      if (articleUrl) {
        this.articleService.getArticle(articleUrl)
          .subscribe({
            next: (article: ArticleType) => {
              this.article = article;

              if (article.commentsCount) {
                this.commentsCount = article.commentsCount;
              }
              if (article.comments.length) {
                this.comments = article.comments;

                this.commentService.getArticleCommentActions(article.id)
                  .subscribe({
                    next: (appliedActions: AppliedCommentActionType[] | DefaultResponseType) => {
                      if ((appliedActions as DefaultResponseType).error !== undefined) {
                        throw new Error((appliedActions as DefaultResponseType).message);
                      }
                      this.appliedCommentActions = appliedActions as AppliedCommentActionType[];

                      AppliedActionsUtil.setMyReactions(this.appliedCommentActions, this.comments);

                      this.appliedCommentActions.forEach(action => {
                        const foundComment = this.comments.find(comment => action.comment === comment.id);
                        if (foundComment) {
                          if (action.action === CommentActionsType.like) {
                            foundComment.likedFromMe = true;
                          }
                          if (action.action === CommentActionsType.dislike) {
                            foundComment.dislikedFromMe = true;
                          }
                        }
                      });
                    }
                  });
              }
            },
            error: (error: HttpErrorResponse) => {
              this._snackBar.open('Не удалось получить статью');
              throw new Error(error.error.message);
            }
          });
        this.articleService.getRelatedArticles(articleUrl)
          .subscribe({
            next: (articles: ArticlePreviewType[]) => {
              this.relatedArticles = articles;
            }
          })
      } else {
        this.router.navigate(['/not-found']).then();
      }
    });

    this.isLogged = this.authService.getIsLoggedIn();
  }

  addComment() {
    if (this.article && this.myCommentText) {
      this.commentService.addComment({
        article: this.article.id,
        text: this.myCommentText
      }).subscribe({
        next: (result: DefaultResponseType) => {
          this.myCommentText = '';
          if (result.error) {
            this._snackBar.open('Не удалось добавить комментарий. Попробуйте ещё раз');
            throw new Error(result.message);
          }
          this._snackBar.open('Комментарий успешно добавлен!');
          this.getComments(0);
          this.commentsCountLoaded = 10;
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open('Не удалось добавить комментарий. Попробуйте ещё раз');
          throw new Error(error.error.message);
        }
      })
    }
  }

  getMoreComments() {
    this.getComments(this.commentsCountLoaded);
    this.commentsCountLoaded += 10;
  }

  getComments(offset: number) {
    if (this.article) {
      this.commentsInLoad = true;
      this.commentService.getComments(offset, this.article.id)
        .subscribe({
          next: (comments: CommentsType | DefaultResponseType) => {
            this.commentsInLoad = false;
            if ((comments as DefaultResponseType).error !== undefined) {
              this._snackBar.open('Не удалось получить комментарии');
              throw new Error((comments as DefaultResponseType).message);
            }
            const resultComments = comments as CommentsType;

            AppliedActionsUtil.setMyReactions(this.appliedCommentActions, resultComments.comments);

            if (resultComments.comments.length) {
              if (offset === 0) {
                this.comments = resultComments.comments;
              } else {
                this.comments = [...this.comments, ...resultComments.comments];
              }
            }
            if (resultComments.allCount) {
              this.commentsCount = resultComments.allCount;
            }
          },
          error: (error: HttpErrorResponse) => {
            this.commentsInLoad = false;
            this._snackBar.open('Не удалось получить комментарии');
            throw new Error(error.error.message);
          }
        });
    }
  }

  applyCommentAction(action: CommentActionsType, comment: CommentType) {
    this.commentService.applyCommentAction(action, comment.id)
      .subscribe({
        next: (result: DefaultResponseType) => {
          if (result.error) {
            this._snackBar.open(result.message);
            throw new Error(result.message);
          }
          if (action === CommentActionsType.like || action === CommentActionsType.dislike) {
            this._snackBar.open('Ваш голос учтён');

            if (action === CommentActionsType.like) {
              if (comment.dislikedFromMe) {
                comment.dislikedFromMe = false;
                comment.dislikesCount--;
              }
              if (comment.likedFromMe) {
                comment.likesCount--;
              } else {
                comment.likesCount++;
              }
              comment.likedFromMe = !comment.likedFromMe;
            }
            if (action === CommentActionsType.dislike) {
              if (comment.likedFromMe) {
                comment.likedFromMe = false;
                comment.likesCount--;
              }
              if (comment.dislikedFromMe) {
                comment.dislikesCount--;
              } else {
                comment.dislikesCount++;
              }
              comment.dislikedFromMe = !comment.dislikedFromMe;
            }
          }
          if (action === CommentActionsType.violate) {
            this._snackBar.open('Жалоба отправлена');
          }
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open('Жалоба уже отправлена');
          throw new Error(error.error.message);
        }
      });
  }
}
