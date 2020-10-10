import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   email :string;
   expire :string;
   role :string;
  constructor(private http: HttpClient, private service: CryptService) {
    if(this.IsUserResgistered()){
       this.email = this.service.Decrypt(localStorage.getItem('email'));
       this.expire = this.service.Decrypt(localStorage.getItem('expire'));
       this.role = this.service.Decrypt(localStorage.getItem('role'));
    }
   }

  baseUrl = 'http://localhost:60761/Account/';


  public installStorage(rem: boolean, email: string) {
    const day = new Date();
    if (rem) {
      day.setDate(day.getDate() + 10);
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

  IsExpiredDate(date:string){
    const dateNow = new Date();
    const expireDate = new Date(Date.parse(date));
    if(expireDate<dateNow){
      localStorage.clear();
      return true;
    }
    return false;
  }

  IsUserResgistered() {
    if (localStorage.getItem('email') != null && localStorage.getItem('expire') != null && localStorage.getItem('role') != null) {
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
