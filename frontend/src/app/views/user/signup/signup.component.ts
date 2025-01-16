import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserAuthType} from "../../../../types/user-auth.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  showPassword: boolean = false;
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^\\s*([А-ЯЁ][а-яё]+[\\-\\s]?){1,3}\\s*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]],
    agree: ['', [Validators.requiredTrue]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get agree() {
    return this.signupForm.get('agree');
  }

  ngOnInit(): void {
  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name
      && this.signupForm.value.email && this.signupForm.value.password) {
      this.authService.signup({
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      }).subscribe({
        next: (authInfo: UserAuthType | DefaultResponseType) => {
          if ((authInfo as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Не удалось зарегистрироваться. Попробуйте ещё раз');
            throw new Error((authInfo as DefaultResponseType).message);
          }
          this._snackBar.open('Вы успешно зарегистрировались');
          this.authService.setTokens(authInfo as UserAuthType);
          this.router.navigate(['/']).then();
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open('Не удалось зарегистрироваться. Попробуйте ещё раз');
        }
      });
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
