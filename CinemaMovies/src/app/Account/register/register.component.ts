import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterModel } from 'src/app/models/register-model';
import { User } from 'src/app/models/user';
import { RegisterServiceService } from 'src/app/services/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private fb : FormBuilder , private service: RegisterServiceService) { }

  userForm : FormGroup;
  users:User[];
  message = '';

  messageValidate={
    userName: {
      required:'*Username is required',
      userNameExist:'*UserName is used'
    },
    email: {
      required:'*Email is required',
      notValid:'*Email not valid',
      emailExist:'*Email is used'
    },
    password: {
      required:'*Password is required',
      inValid:'*Password is must contain at least one numeric digit, one uppercase and one lowercase letter',
      minlength: '*Password must be at least 6 char'
    },
    confirmPassword: {
      required:'*Password confirmation is required',
      notMatch: '*The password and confirmation password do not match.'
    }
  }
  reg: RegisterModel;


  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmPassword:['',[Validators.required,Validators.minLength(6)]]
    }) ;

    this.reg = {
      userName : '',
      email:'',
      password :'',
      confirmPassword:''
    };

    this.users = [];
    this.allUsers();
  }
  register(){
    // debugger;
    // if(this.IsUserNameExist()){
    //   this.message = 'UserName is  exsit';
    //   return;
    // }
    // else {
    //   this.message = '';
    // }

    if(this.userForm.valid){
        this.ValidateRegisterModel();
        if(this.reg.password == this.reg.confirmPassword){
          this.service.Register(this.reg).subscribe(success  => {
            this.allUsers();
            this.userForm.reset();
            this.userForm.value.password = '';
            this.message = 'Registration complate successfully. Please check your mail for active account';
          }, err => console.log(err));
      }
    }
  }
  ValidateRegisterModel() {
    this.reg.userName = this.userForm.value.userName;
    this.reg.email = this.userForm.value.email;
    this.reg.password = this.userForm.value.password;
    this.reg.confirmPassword = this.userForm.value.confirmPassword;
  }
  IsPasswordMatch(){
    if(this.userForm.value.password != '' && this.userForm.value.confirmPassword != ''){
      if((this.userForm.value.password  !== this.userForm.value.confirmPassword))
          return true;
    }
    return false;
  }
  IsPasswordValid(){
    const pass = this.userForm.value.password;
    var passw=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(pass.match(passw)){
      return true;
    }
    return false;
  }

  allUsers(){
    this.service.GetAllUsers().subscribe(list => {
      this.users = list;
    },err=>{alert(err.error())}
    );
  }

  IsUserNameExist(){
    if(this.userForm.value.userName != '' ){
      this.service.UserNameExist(this.userForm.value.userName).subscribe(
        res=>{
          console.log(res);
          return true;
        },err=>console.log(err)
      )
    }
    return false;
  }
}
