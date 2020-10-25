import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import * as $ from "jquery";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private service: AdminService, private router: Router) { }
  Users: User[];
  checked: boolean;
  ngOnInit() {
    this.checked = false;
    this.GetAllUsers();
  }

  GetAllUsers(){
    this.service.GetAllUsers().subscribe(success => {
      this.Users = success;
    }, err => console.log(err));
  }

  EditUser(id: string) {
    this.router.navigate(['/edituser', id]);
  }

  SelectAll() {
    var tbl = $('#tbl');
    var header = tbl.find('thead .ckheader');
    var item = tbl.find('tbody .ckitem');

    $(function () {
      item.on('change', function () {
        if ($(this).is(':checked')) {
          $(this).closest('tr').addClass('NewRowColor');
        }
        else {
          $(this).closest('tr').removeClass('NewRowColor');
        }
      });

      header.change(function () {
        var c = this.checked;
        item.prop("checked", c);
        item.trigger('check');
        if ($(this).is(':checked')) {
          $(item).closest('tr').addClass('NewRowColor');
        }
        else {
          $(item).closest('tr').removeClass('NewRowColor');
        }
      });
    });
  }

  IsDelete() {
    var checkBoxs = document.getElementsByClassName("ckitem");
    for (let index = 0; index < checkBoxs.length; index++) {
      const element = checkBoxs[index];
      if ($(element).is(':checked')) {
        return true;
      }
    }
    return false;
  }

  DeleteUsers() {
    var checkBoxs = document.getElementsByClassName("ckitem");
    var ids = [];
    for (let index = 0; index < checkBoxs.length; index++) {
      const element = checkBoxs[index];
      if ($(element).is(':checked')) {
        ids.push($(element).val());
      }
    }
    if (ids.length > 0) {
      this.service.DeleteUsers(ids).subscribe(success => {
        this.GetAllUsers();
        $('#btnClose').trigger('click');
      }, err => console.log(err));
    }
  }
}
