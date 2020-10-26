import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/UserRoleModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-UserRoles',
  templateUrl: './UserRoles.component.html',
  styleUrls: ['./UserRoles.component.css']
})
export class UserRolesComponent implements OnInit {

  constructor(private service: AdminService,private router : Router) { }

  userRoles: UserRole[];
  ngOnInit() {
    this.userRoles = [];
    this.GetUserRoles();
  }
  GetUserRoles() {
    this.service.GetUserRoles().subscribe(success => {
      this.userRoles = success;
    }, err => console.log(err));
  }
  EditRole(userId : string,roleId : string){
    this.router.navigate(['edituserrole',userId,roleId]);
  }
}
