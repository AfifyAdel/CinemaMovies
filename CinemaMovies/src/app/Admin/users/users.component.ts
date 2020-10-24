import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private service: AdminService, private router: Router) { }
  Users: User[];
  ngOnInit() {
    this.service.GetAllUsers().subscribe(success => {
      this.Users = success;
    }, err => console.log(err));
  }


  EditUser(id: string) {
    this.router.navigate(['/edituser', id]);
  }
}
