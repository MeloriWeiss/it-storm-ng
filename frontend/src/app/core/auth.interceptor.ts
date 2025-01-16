import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, map, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {UserAuthType} from "../../types/user-auth.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', accessToken)
      });

      return next.handle(authReq)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle401Error(authReq, next);
            }
            return throwError(() => error);
          })
        )
    }
    return next.handle(req);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: UserAuthType | DefaultResponseType) => {
          let error = '';

          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }
          const refreshResult = result as UserAuthType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Authorization error';
          }
          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(result as UserAuthType);

          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          });

          return next.handle(authReq);
        }),
        catchError((error: HttpErrorResponse) => {
          this.authService.removeTokens();
          this.router.navigate(['/']).then();
          return throwError(() => error);
        })
      );
  }
}
