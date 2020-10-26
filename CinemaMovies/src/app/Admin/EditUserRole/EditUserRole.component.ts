import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { strict } from 'assert';
import { RoleModel } from 'src/app/models/RoleModel';
import { UserRole } from 'src/app/models/UserRoleModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-EditUserRole',
  templateUrl: './EditUserRole.component.html',
  styleUrls: ['./EditUserRole.component.css']
})
export class EditUserRoleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private service: AdminService
  ) { }
  userForm: FormGroup;
  userId: string;
  roleId: string;
  userName : string;
  roleName : string;
  roles:RoleModel[];
  editRoleModel : UserRole;
  ngOnInit() {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      roleName: ['', Validators.required],
    });
    this.editRoleModel = {
      userId:'',
      username:'',
      roleName:'',
      roleId:''
    };
    this.userId = '';
    this.roleId = '';
    this.userName='';
    this.activeRoute.paramMap.subscribe(param => {
      this.userId = param.get('userid');
      this.roleId = param.get('roleid');
      if (this.roleId != null && this.userId != null) {
        this.service.GetUser(this.userId).subscribe(success => {
          this.userId = success.id;
          this.userName  =  success.userName;
          this.FillFields();
        }, err => console.log(err));
        this.service.GetAllRoles().subscribe(success=>{
          this.roles = success;
          this.roleName = this.roles.find(x=>x.id == this.roleId).name;
          this.FillFields();
        },err => console.log(err))
      } else {
        this.router.navigate(['notfound']).then(x => { window.location.reload() });
      }
    })
  }

  FillFields() {
    this.userForm.setValue({
      userName: this.userName,
      roleName: this.roleId
    })
  }

  OnRoleChange(){
    this.roleId = this.userForm.value.roleName;
  }


  EditRole() {
    if(this.userId &&  this.roleId){
      this.editRoleModel.userId = this.userId;
      this.editRoleModel.roleId = this.roleId;
      this.editRoleModel.roleName = this.roleName;
      this.editRoleModel.username = this.userName;
      this.service.EditUserRole(this.editRoleModel).subscribe(success=>{
        console.log(success);
        sessionStorage.setItem("editUserRole","true");
        this.router.navigate(['controlpanel']).then(x=>{window.location.reload()});
      },err=>console.log(err));
    }
  }
}
