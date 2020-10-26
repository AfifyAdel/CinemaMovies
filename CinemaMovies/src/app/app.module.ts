import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './Account/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './Account/register/register.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from './Account/forgetPassword/forgetPassword.component';
import { PasswordconfirmComponent } from './Account/passwordconfirm/passwordconfirm.component';
import { DashboardComponent } from './Admin/Dashboard/Dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { AdduserComponent } from './Admin/adduser/adduser.component';
import { UserRolesComponent } from './Admin/UserRoles/UserRoles.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { DashboardGuardService } from './guards/dashboardGuard.service';
import { RoleModel } from './models/RoleModel';
import { EditUserRoleComponent } from './Admin/EditUserRole/EditUserRole.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    FooterMenuComponent,
    LoginComponent,
    ForgetPasswordComponent,
    PasswordconfirmComponent,
    DashboardComponent,
    UsersComponent,
    AdduserComponent,
    UserRolesComponent,
    NotfoundComponent,
    AccessdeniedComponent,
    EditUserRoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [DashboardGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
