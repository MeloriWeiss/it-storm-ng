import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {LayoutComponent} from "./components/layout/layout.component";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {ServerImageUrlPipe} from "./pipes/server-image-url.pipe";
import {MatMenuModule} from "@angular/material/menu";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import { LoaderComponent } from './components/loader/loader.component';
import {HttpClientModule} from "@angular/common/http";
import { ApplicationPopupContentComponent } from './components/application-popup-content/application-popup-content.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {UserService} from "./services/user.service";
import {RequestService} from "./services/request.service";
import { UserRightsComponent } from './components/user-rights/user-rights.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ArticleCardComponent,
    NotFoundComponent,
    LoaderComponent,
    ApplicationPopupContentComponent,
    UserRightsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    ServerImageUrlPipe
  ],
  providers: [
    UserService,
    RequestService
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent,
    ApplicationPopupContentComponent
  ]
})
export class SharedModule { }
