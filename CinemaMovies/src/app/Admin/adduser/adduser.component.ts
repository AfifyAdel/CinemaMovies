import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminUser } from 'src/app/models/adminuser';
import { EditUser } from 'src/app/models/EditUserModel';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private activeRoute: ActivatedRoute
  ) { }

  userForm: FormGroup;
  user: AdminUser;
  editUserModel: EditUser;
  message = '';
  isbussy: boolean;
  userInfo: User;
  users: User[];
  title: string;
  btnTitle: string;
  isEditMode: boolean;
  messageValidate = {
    userName: {
      required: '*Username is required',
      userNameExist: ''
    },
    email: {
      required: '*Email is required',
      notValid: '*Email not valid',
      emailExist: ''
    },
    password: {
      required: '*Password is required',
      inValid: '*Password is must contain at least one numeric digit, one uppercase and one lowercase letter',
      minlength: '*Password must be at least 6 char'
    },
    confirmPassword: {
      required: '*Password confirmation is required',
      notMatch: '*The password and confirmation password do not match.'
    }
  }
  ngOnInit() {
    this.user = null;
    this.editUserModel = null;
    this.userInfo = null;
    this.btnTitle = 'Add New User';
    this.title = 'Add User';
    this.isEditMode = false;
    this.GetAllUsers();
    this.isbussy = false;
    this.user = {
      userName: '',
      email: '',
      password: '',
      country: '',
      emailConfirmed: false,
      phoneNumber: ''
    };
    this.editUserModel = {
      id:'',
      userName: '',
      email: '',
      password: '',
      country: '',
      emailConfirmed: false,
      phoneNumber: ''
    };
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: '',
      country: '',
      emailConfirmed: false
    });

    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isbussy = true;
      }
    }, err => console.log(err));


    this.activeRoute.paramMap.subscribe(param => {
      var id = param.get('id');
      if (id != null) {
        this.btnTitle = 'Save Changes';
        this.title = 'Edit User';
        this.isEditMode = true;
        this.service.GetUser(id).subscribe(success => {
          this.userInfo = success;
          this.FillFields();
        }, err => console.log(err));
      }
    })
  }
  FillFields() {
    if (this.userInfo != null) {
      this.userForm.setValue({
        userName: this.userInfo.userName,
        email: this.userInfo.email,
        password: this.userInfo.passwordHash,
        confirmPassword: this.userInfo.passwordHash,
        phoneNumber: this.userInfo.phoneNumber,
        country: this.userInfo.country,
        emailConfirmed: this.userInfo.emailConfirmed
      })
    }
  }

  AddUser() {
    if (this.userForm.valid) {
      this.ValidateModel();
      if (this.userForm.value.password == this.userForm.value.confirmPassword) {
        if (this.isEditMode) {
          this.service.EditUser(this.editUserModel).subscribe(success => {
            this.userForm.reset();
            this.userForm.value.password = '';
            this.message = 'Edtion complate successfully.';
          }, err => console.log(err))
        }
        else {
          this.service.AddNewUser(this.user).subscribe(success => {
            this.userForm.reset();
            this.userForm.value.password = '';
            this.message = 'Registration complate successfully.';
          }, err => console.log(err))
        }
      };
    }
  }

  ValidateModel() {
    if (this.isEditMode) {
      this.editUserModel.userName = this.userForm.value.userName;
      this.editUserModel.email = this.userForm.value.email;
      this.editUserModel.password = this.userForm.value.password;
      this.editUserModel.phoneNumber = this.userForm.value.phoneNumber;
      this.editUserModel.country = this.userForm.value.country;
      this.editUserModel.emailConfirmed = this.userForm.value.emailConfirmed;
      this.editUserModel.id = this.userInfo.id;
    }
    else{
      this.user.userName = this.userForm.value.userName;
      this.user.email = this.userForm.value.email;
      this.user.password = this.userForm.value.password;
      this.user.phoneNumber = this.userForm.value.phoneNumber;
      this.user.country = this.userForm.value.country;
      this.user.emailConfirmed = this.userForm.value.emailConfirmed;
    }
  }
  IsPasswordMatch() {
    if (this.userForm.value.password != '' && this.userForm.value.confirmPassword != '') {
      if ((this.userForm.value.password !== this.userForm.value.confirmPassword))
        return true;
    }
    return false;
  }
  IsPasswordValid() {
    const pass = this.userForm.value.password;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (pass.match(passw)) {
      return true;
    }
    return false;
  }


  IsUserNameExist() {
    const name = this.userForm.value.userName;
    if (name != null && name != '') {
      if (this.users != null && this.users.findIndex(x => x.userName == name && x.userName !== this.userInfo.userName) !== -1) {
        this.messageValidate.userName.userNameExist = '*Username is used';
        return true;
      }
    }
    this.messageValidate.userName.userNameExist = null;
    return false;
  }

  IsEmailExist() {
    const email = this.userForm.value.email;
    if (email != null && email != '') {
      if (this.users != null && this.users.findIndex(x => x.email == email && x.email !== this.userInfo.email) !== -1) {
        this.messageValidate.email.emailExist = '*Email is used';
        return true;
      }
    }
    this.messageValidate.email.emailExist = null;
    return false;
  }

  GetAllUsers() {
    this.service.GetAllUsers().subscribe(success => {
      this.users = success;
    }, err => console.log(err));
  }
}
