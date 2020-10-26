import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  IsUserList: boolean;
  IsAddUser :boolean;
  IsUserRoles :boolean;

  ngOnInit() {
    this.IsUserList = false;
    this.IsAddUser = false;
    this.IsUserRoles = false;
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
    if(sessionStorage.getItem("editUserRole")){
      this.CheckUserRoles();
      sessionStorage.removeItem("editUserRole")
    }
  }
  CheckUser() : boolean{
    this.IsUserRoles = false;
    this.IsAddUser = false;
    return this.IsUserList = true;
  }
  CheckAddUser() : boolean{
    this.IsUserRoles = false;
    this.IsUserList = false;
    return this.IsAddUser = true;
  }
  CheckUserRoles() : boolean{
    this.IsAddUser = false;
    this.IsUserList = false;
    return this.IsUserRoles = true;
  }
}
