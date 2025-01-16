import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, Subject, throwError} from "rxjs";
import {UserAuthType} from "../../types/user-auth.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {UserSignupFormType} from "../../types/user-signup-form.type";
import configTokens from "../config/configTokens";
import {UserLoginFormType} from "../../types/user-login-form.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $isLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  signup(formData: UserSignupFormType): Observable<UserAuthType | DefaultResponseType> {
    return this.http.post<UserAuthType | DefaultResponseType>(environment.api + 'signup', formData);
  }

  login(formData: UserLoginFormType): Observable<UserAuthType | DefaultResponseType> {
    return this.http.post<UserAuthType | DefaultResponseType>(environment.api + 'login', formData);
  }

  logout(): Observable<DefaultResponseType> {
    const refreshToken = this.getRefreshToken();
    this.removeTokens();
    if (refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken});
    }
    throw throwError(() => new Error('logout error'));
  }

  refresh(): Observable<UserAuthType | DefaultResponseType> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.http.post<UserAuthType | DefaultResponseType>(environment.api + 'refresh', {refreshToken});
    }
    throw throwError(() => 'Refresh token not found');
  }

  getIsLoggedIn(): boolean {
    return !!localStorage.getItem(configTokens.accessToken);
  }

  setTokens(userInfo: UserAuthType) {
    localStorage.setItem(configTokens.accessToken, userInfo.accessToken);
    localStorage.setItem(configTokens.refreshToken, userInfo.refreshToken);
    this.$isLoggedIn.next(true);
  }

  removeTokens() {
    localStorage.removeItem(configTokens.accessToken);
    localStorage.removeItem(configTokens.refreshToken);
    this.$isLoggedIn.next(false);
  }

  getAccessToken() {
    const accessToken = localStorage.getItem(configTokens.accessToken);
    return accessToken ? accessToken : null;
  }

  getRefreshToken() {
    const refreshToken = localStorage.getItem(configTokens.refreshToken);
    return refreshToken ? refreshToken : null;
  }
}
