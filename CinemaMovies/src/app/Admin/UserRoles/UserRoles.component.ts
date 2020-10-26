import { Component, OnInit } from '@angular/core';
import { UserRole } from 'src/app/models/UserRoleModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-UserRoles',
  templateUrl: './UserRoles.component.html',
  styleUrls: ['./UserRoles.component.css']
})
export class UserRolesComponent implements OnInit {

  constructor(private service: AdminService) { }

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
}
