import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {take, tap} from "rxjs";
import {Location} from "@angular/common";
import configNavigationUrls from "../../../config/configNavigationUrls";
import {SetActiveUrlUtil} from "../../utils/set-active-url.util";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  userName: string = '';
  activeUrl: string = '';
  configNavigationUrls = configNavigationUrls;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    if (this.isLogged) {
      this.getUserInfo();
    }

    this.authService.$isLoggedIn
      .subscribe(isLoggedIn => {
        this.isLogged = isLoggedIn;

        if (isLoggedIn) {
          this.getUserInfo();
        }
      });

    this.activatedRoute.fragment
      .pipe(
        take(1)
      )
      .subscribe(fragment => {
        if (fragment) {
          this.activeUrl = SetActiveUrlUtil.setUrl(fragment);
        }
      });

    if (!this.activeUrl) {
      this.activeUrl = SetActiveUrlUtil.setUrl(this.location.path());
    }
    this.location.onUrlChange(url => {
      this.activeUrl = SetActiveUrlUtil.setUrl(url);
    });
  }

  getUserInfo() {
    this.userService.getUserInfo()
      .subscribe({
        next: (result: UserInfoType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          }
          this.userName = (result as UserInfoType).name;
        },
        error: (error: HttpErrorResponse) => {
          throw new Error(error.error.message);
        }
      });
  }

  logout() {
    this.authService.logout()
      .pipe(
        tap(() => {
          this.router.navigate(['/login']).then();
          this._snackBar.open('Вы успешно вышли из системы');
        })
      )
      .subscribe();
    this.router.navigate(['login']).then();
  }
}
