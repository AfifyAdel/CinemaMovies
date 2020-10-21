import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../models/adminuser';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

constructor(private http: HttpClient) { }

baseUrl = 'http://localhost:60761/Admin/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials : true
  };


  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'GetAllUsers',this.headers).pipe();
  }

  AddNewUser(model : AdminUser): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.baseUrl + 'AddNewUser',model,this.headers).pipe();
  }
}
