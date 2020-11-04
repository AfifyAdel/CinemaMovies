import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login-model';
import { AuthService } from 'src/app/services/auth.service';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: LoginServiceService,
    private authService: AuthService,
    private router: Router
  ) { }


  logModel: LoginModel;
  message: string;
  loginForm: FormGroup;
  btnClick : boolean;
  messageValidate = {
    email: {
      required: '*Email is required',
      notValid: '*Email not valid'
    },
    password: {
      required: '*Password is required',
    }
  }
  ngOnInit(): void {
    this.btnClick = false;
    this.message = '';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remeberme: false
    });

    this.logModel = {
      email: '',
      password: '',
      remeberme: false
    };

  }

  login() {
    this.btnClick = true;
    if (this.loginForm.valid) {
      this.ValidateLoginModel();
      this.service.Login(this.logModel).subscribe(success => {
        this.authService.installStorage(!!this.loginForm.value.remeberme,this.loginForm.value.email);
        this.router.navigate(['home']).then(x=>{window.location.reload()});
      }, err => { console.log(err); this.message = err.error;this.btnClick = false; });
    }
  }

  ValidateLoginModel() {
    this.logModel.email = this.loginForm.value.email;
    this.logModel.password = this.loginForm.value.password;
    this.logModel.remeberme = this.loginForm.value.remeberme;
  }

  IsPasswordValid() {
    const pass = this.loginForm.value.password;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (pass.match(passw)) {
      return true;
    }
    return false;
  }
}
