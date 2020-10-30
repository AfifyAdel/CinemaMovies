import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryListComponent } from '../Admin/Categories/categoryList/categoryList.component';
import { AdminUser } from '../models/adminuser';
import { Category } from '../models/CategoryModel';
import { EditUser } from '../models/EditUserModel';
import { RoleModel } from '../models/RoleModel';
import { SubCategory } from '../models/SubCategory';
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

  GetAllRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.baseUrl + 'GetAllRoles', this.headers).pipe();
  }

  EditUserRole(model : UserRole): Observable<UserRole> {
    return this.http.put<UserRole>(this.baseUrl + 'EditUserRole' , model, this.headers).pipe();
  }

  GetAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl + 'GetAllCategories', this.headers).pipe();
  }

  AddCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl + 'AddCategory', category, this.headers).pipe();
  }

  EditCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(this.baseUrl + 'EditCategory', category, this.headers).pipe();
  }

  DeleteCategory(category: Category) {
    return this.http.post(this.baseUrl + 'DeleteCategory', category, this.headers).pipe();
  }

  GetCategory(id : string): Observable<Category> {
    return this.http.get<Category>(this.baseUrl + 'GetCategory/' + id, this.headers).pipe();
  }

  GetAllSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.baseUrl + 'GetSubCategories', this.headers).pipe();
  }

  AddSubCategory(model: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.baseUrl + 'AddSubCategory', model, this.headers).pipe();
  }

  EditSubCategory(model: SubCategory): Observable<SubCategory> {
    return this.http.put<SubCategory>(this.baseUrl + 'EditSubCategory', model, this.headers).pipe();
  }

  DeleteSubCategory(model: SubCategory) {
    return this.http.post(this.baseUrl + 'DeleteSubCategory', model, this.headers).pipe();
  }
}
