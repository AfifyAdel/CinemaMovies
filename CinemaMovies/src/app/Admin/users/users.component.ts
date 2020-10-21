import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private service :  AdminService) { }
  Users : User[];
  ngOnInit() {
    this.service.GetAllUsers().subscribe(success=>{
      this.Users = success;
      console.log(success);
    },err=>console.log(err));
  }

}
