import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:60761/Account/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  Register(reg: RegisterModel): Observable<RegisterModel> {
    return this.http.post<RegisterModel>(this.baseUrl + 'Register', reg, this.headers).pipe();
  }
  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'GetAllUsers').pipe();
  }

}
