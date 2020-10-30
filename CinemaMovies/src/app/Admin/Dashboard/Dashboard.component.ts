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
  IsCategoryList :boolean;
  IsSubCategoryList :boolean;

  ngOnInit() {
    this.IsUserList = false;
    this.IsAddUser = false;
    this.IsUserRoles = false;
    this.IsCategoryList = false;
    this.IsSubCategoryList = false;
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
    if(sessionStorage.getItem("editUserRole")){
      this.CheckUserRoles();
      sessionStorage.removeItem("editUserRole")
    }
    if(sessionStorage.getItem("cat")){
      this.CheckCategories();
      sessionStorage.removeItem("cat")
    }
    if(sessionStorage.getItem("subcat")){
      this.CheckSubCategories();
      sessionStorage.removeItem("subcat")
    }
  }
  CheckUser() : boolean{
    this.IsUserRoles = false;
    this.IsAddUser = false;
    this.IsCategoryList = false;
    this.IsSubCategoryList = false;
    return this.IsUserList = true;
  }
  CheckAddUser() : boolean{
    this.IsUserRoles = false;
    this.IsUserList = false;
    this.IsCategoryList = false;
    this.IsSubCategoryList = false;
    return this.IsAddUser = true;
  }
  CheckUserRoles() : boolean{
    this.IsAddUser = false;
    this.IsUserList = false;
    this.IsCategoryList = false;
    this.IsSubCategoryList = false;
    return this.IsUserRoles = true;
  }
  CheckCategories() : boolean{
    this.IsUserRoles = false;
    this.IsAddUser = false;
    this.IsUserList = false;
    this.IsSubCategoryList = false;
    return this.IsCategoryList = true;
  }
  CheckSubCategories() : boolean{
    this.IsUserRoles = false;
    this.IsAddUser = false;
    this.IsUserList = false;
    this.IsCategoryList = false;
    return this.IsSubCategoryList = true;
  }
}
