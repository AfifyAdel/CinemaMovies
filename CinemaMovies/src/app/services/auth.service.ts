import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private service: CryptService) { }

  baseUrl = 'http://localhost:60761/Account/';

  public installStorage(rem: boolean, email: string) {
    const day = new Date();
    if (rem) {
      day.setDate(day.getDay() + 10);
    }
    else {
      day.setMinutes(day.getMinutes() + 30);
    }
    localStorage.setItem('email', this.service.Encrypt(email));
    localStorage.setItem('expire', this.service.Encrypt(day.toString()));
    this.GetRoleName(email).subscribe(
      succ => {
        localStorage.setItem('role', this.service.Encrypt(succ.toString()));
      }, err => console.log(err));
  }

  CheckStorage() {
      const email = this.service.Decrypt(localStorage.getItem('email'));
      const expire = this.service.Decrypt(localStorage.getItem('expire'));
      const role = this.service.Decrypt(localStorage.getItem('role'));
      if(email != null && role != null){
        this.ValidateUser(email,role).subscribe(success=>{
          if(!this.IsExpiredDate(expire)){
            console.log(success);
            return true;
          }
        },err=>console.log(err))
      }
    return false;
  }

  IsExpiredDate(date:string){
    const dateNow = new Date();
    const expireDate = new Date(Date.parse(date));
    if(expireDate<dateNow){
      localStorage.clear();
      return true;
    }
    return false;
  }
  GetRoleName(email) {
    return this.http.get(this.baseUrl + 'GetRoleName/' + email, { responseType: 'text' }).pipe();
  }

  ValidateUser(email:string,role:string) {
    return this.http.get(this.baseUrl + 'CheckUserClaims/' + email +  '/' + role,{withCredentials : true}).pipe();
  }
}
