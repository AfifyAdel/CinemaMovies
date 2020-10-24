import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './Account/login/login.component';
import { RegisterComponent } from './Account/register/register.component';
import { HomeComponent } from './home/home.component';
import { RegisterconfirmComponent } from './Account/registerconfirm/registerconfirm.component';
import { ForgetPasswordComponent } from './Account/forgetPassword/forgetPassword.component';
import { PasswordconfirmComponent } from './Account/passwordconfirm/passwordconfirm.component';
import { DashboardComponent } from './Admin/Dashboard/Dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { AdduserComponent } from './Admin/adduser/adduser.component';

const routes: Routes = [
  {path : '',component:HomeComponent,pathMatch :'full'},
  {path : 'login',component:LoginComponent},
  {path : 'register',component:RegisterComponent},
  {path : 'home',component:HomeComponent},
  {path : 'registerconfirm',component:RegisterconfirmComponent},
  {path : 'forgetpassword',component:ForgetPasswordComponent},
  {path : 'passwordconfirm',component:PasswordconfirmComponent},
  {path : 'controlpanel',component:DashboardComponent},
  {path : 'users',component:UsersComponent},
  {path : 'adduser',component:AdduserComponent},
  {path : 'edituser/:id',component:AdduserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }
