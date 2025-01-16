import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog/blog.component';
import {ArticleComponent} from "./article/article.component";
import {SharedModule} from "../../shared/shared.module";
import {ServerImageUrlPipe} from "../../shared/pipes/server-image-url.pipe";
import {FormsModule} from "@angular/forms";
import {CommentService} from "./services/comment.service";
import {CategoryService} from "./services/category.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../../core/auth.interceptor";
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";


@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent
  ],
  providers: [
    CommentService,
    CategoryService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  imports: [
    CommonModule,
    ServerImageUrlPipe,
    ShareButtonsModule,
    FormsModule,
    SharedModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
