import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(
    private service: LoginServiceService,
    private route: Router,
    private auth: AuthService
  ) { }
  title = 'Cinema Movies';


  ngOnInit(): void {
    if (this.IsUserResgistered()) {
      if(this.auth.IsExpiredDate(this.auth.expire)){
        this.Logout();
      }
      this.auth.ValidateUser(this.auth.email,this.auth.role).subscribe(success=>{
        console.log("success");
      },err=>{console.log(err);this.Logout()});
    }
  }
  Logout() {
    this.service.Logout().subscribe(
      res => {
        localStorage.clear();
        this.route.navigate(['home']);
      }, err => console.log(err)
    )
  }

  IsUserResgistered() {
    if (localStorage.getItem('email') != null && localStorage.getItem('expire') != null && localStorage.getItem('role') != null) {
      return true;
    }
    return false;
  }
}
