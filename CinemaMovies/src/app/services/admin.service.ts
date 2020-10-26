import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../models/adminuser';
import { EditUser } from '../models/EditUserModel';
import { User } from '../models/user';
import { UserRole } from '../models/UserRoleModel';

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
    withCredentials: true
  };


  GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'GetAllUsers', this.headers).pipe();
  }

  AddNewUser(model: AdminUser): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.baseUrl + 'AddNewUser', model, this.headers).pipe();
  }

  GetUser(id: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'GetUser/' + id, this.headers).pipe();
  }

  EditUser(model: EditUser): Observable<User> {
    return this.http.put<User>(this.baseUrl + 'EditUser', model, this.headers).pipe();
  }

  DeleteUsers(ids: string[]) {
    return this.http.post(this.baseUrl + 'DeleteUsers', ids, this.headers).pipe();
  }

  GetUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.baseUrl + 'GetUsersRoles', this.headers).pipe();
  }
}
