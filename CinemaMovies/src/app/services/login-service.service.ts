import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login-model';
import { ResetPasswordModel } from '../models/resetPassword';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  RegisterConfirmation(id: any, token: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:60761/Account/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials : true
  };

  Login(model: LoginModel): Observable<LoginModel> {
    return this.http.post<LoginModel>(this.baseUrl + 'Login', model, this.headers).pipe();
  }

  Logout() {
    return this.http.get(this.baseUrl + 'Logout' , {withCredentials : true}).pipe();
  }

  ForgetPassword(email) {
    return this.http.get(this.baseUrl + 'ForgetPassword/'+email).pipe();
  }

  ResetPassord(model : ResetPasswordModel) : Observable<ResetPasswordModel> {
    return this.http.post<ResetPasswordModel>(this.baseUrl + 'ResetPassword', model, this.headers).pipe();
  }
}
