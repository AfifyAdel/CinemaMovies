import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterModel } from 'src/app/models/register-model';
import { RegisterServiceService } from 'src/app/services/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private fb : FormBuilder , private service: RegisterServiceService) { }

  userForm : FormGroup;

  messageValidate={
    userName: {
      required:'*Username is required'
    },
    email: {
      required:'*Email is required'
    },
    password: {
      required:'*Password is required',
      minlength: '*Password must be at least 6 char'
    }
  }
  reg: RegisterModel;


  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName:['',Validators.required],
      email:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(6)]]
    }) ;

    this.reg = {
      userName : '',
      email:'',
      password :''
    };
  }
  register(){
    debugger;
    if(this.userForm.valid){
        this.ValidateRegisterModel();
        this.service.Register(this.reg).subscribe(success  => {
          alert('Registertion Complete')
        }, err => console.log(err));
    }
  }
  ValidateRegisterModel() {
    this.reg.userName = this.userForm.value.userName;
    this.reg.email = this.userForm.value.email;
    this.reg.password = this.userForm.value.password;
  }
}
