import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/components/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";
import {AuthForwardGuard} from "./core/auth-forward.guard";
import {UserRightsComponent} from "./shared/components/user-rights/user-rights.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', component: MainComponent},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule), canActivate: [AuthForwardGuard]},
      {path: '', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      {path: '**', component: NotFoundComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
