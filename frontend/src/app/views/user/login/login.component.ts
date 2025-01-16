import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserAuthType} from "../../../../types/user-auth.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: ['']
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: Boolean(this.loginForm.value.rememberMe),
      }).subscribe({
        next: (authInfo: UserAuthType | DefaultResponseType) => {
          if ((authInfo as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Не удалось авторизоваться. Попробуйте ещё раз');
            throw new Error((authInfo as DefaultResponseType).message);
          }
          this._snackBar.open('Вы успешно авторизовались');
          this.authService.setTokens(authInfo as UserAuthType);
          this.router.navigate(['/']).then();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400 || error.status === 401) {
            this._snackBar.open(error.error.message);
            throw new Error(error.error.message);
          }
          this._snackBar.open('Не удалось войти. Попробуйте ещё раз');
        }
      });
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
