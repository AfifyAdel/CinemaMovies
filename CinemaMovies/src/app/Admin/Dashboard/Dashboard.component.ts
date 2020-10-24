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
  ngOnInit() {
    this.IsUserList = false;
    this.IsAddUser = false;
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });
  }
  CheckUser() : boolean{
    this.IsAddUser = false;
    return this.IsUserList = true;
  }
  CheckAddUser() : boolean{
    this.IsUserList = false;
    return this.IsAddUser = true;
  }
}
