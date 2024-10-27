import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemErrorComponent } from 'src/app/shared/component/error/system-error.component';
import { UserListComponent } from './list/user-list.component';
import { AuthorizeGuard } from '../../shared/auth/authorize.guard';
import { Adm004Component } from './adm004/adm004.component';
import { Adm005Component } from './adm005/adm005.component';
import { Adm006Component } from './adm006/adm006.component';
import { Adm003Component } from './adm003/adm003.component';

const routes: Routes = [
  { path: 'user', redirectTo: 'user/list', pathMatch: 'full' },
  { path: 'user/list', component: UserListComponent, canActivate: [AuthorizeGuard] },
  { path: 'user/detail', component: Adm003Component, canActivate: [AuthorizeGuard] }, 
  { path: 'user/add', component: Adm004Component, canActivate: [AuthorizeGuard] },
  { path: 'user/confirm', component:Adm005Component, canActivate: [AuthorizeGuard] },
  {path: 'user/message-success', component:Adm006Component, canActivate: [AuthorizeGuard]},
  { path: '**', component: SystemErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
