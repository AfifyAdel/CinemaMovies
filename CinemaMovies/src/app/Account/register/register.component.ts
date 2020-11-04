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
  reg: RegisterModel;
  message = '';
  isbussy :  boolean;
  btnClick : boolean;

  messageValidate={
    userName: {
      required:'*Username is required',
      userNameExist:''
    },
    email: {
      required:'*Email is required',
      notValid:'*Email not valid',
      emailExist:''
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


  ngOnInit(): void {
    this.btnClick = false;
    this.isbussy  = false;
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
    this.userForm.valueChanges.subscribe(x=>{
        if(this.userForm.status == 'VALID'){
          this.isbussy = true;
        }
    },err=>console.log(err));
  }
  register(){
    this.btnClick = true;
    if(this.userForm.valid){
        this.ValidateRegisterModel();
        if(this.reg.password == this.reg.confirmPassword){
          this.service.Register(this.reg).subscribe(success  => {
            this.userForm.reset();
            this.userForm.value.password = '';
            this.message = 'Registration complate successfully. Please check your E-mail for active account';
            this.btnClick = false;
          }, err => {console.log(err);this.btnClick = false;});
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
    if(pass !== null && pass!=='' && pass.match(passw)){
      return true;
    }
    return false;
  }


  IsUserNameExist(){
    const name = this.userForm.value.userName;
    if(name != null && name != '' && this.isbussy === false ){
      this.service.UserNameExist(this.userForm.value.userName).subscribe(
        res=>{
          this.messageValidate.userName.userNameExist = '*Username is used';
        },err=>console.log(err));
    }
    else {
      this.messageValidate.userName.userNameExist = null;
    }
    return false;
  }

  IsEmailExist(){
    const email = this.userForm.value.email;
    if(email != null && email != '' && this.isbussy === false ){
      this.service.EmailExist(this.userForm.value.email).subscribe(
        res=>{
          this.messageValidate.email.emailExist = '*Email is used';
        },err=>console.log(err));
    }
    else {
      this.messageValidate.email.emailExist = null;
    }
    return false;
  }
}
