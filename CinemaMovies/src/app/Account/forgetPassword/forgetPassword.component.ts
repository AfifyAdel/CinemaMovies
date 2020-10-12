import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptService } from 'src/app/services/crypt.service';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-forgetPassword',
  templateUrl: './forgetPassword.component.html',
  styleUrls: ['./forgetPassword.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service : LoginServiceService,
    private crypService : CryptService
    ) { }

  messageValidate = {
    email: {
      required: '*Email is required',
      notValid: '*Email not valid'
    },
  }
  message:string;
  forgetForm: FormGroup;
  ngOnInit() {
    this.message='';
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  RequestPassword(){
      this.service.ForgetPassword(this.forgetForm.get('email').value).subscribe(success=>{
          var token = Object.values(success).toString();
          var newToken = this.crypService.Encrypt(token);
          var cnt = 0;
          while(localStorage.getItem('token'+cnt) !== null)
            cnt++;
          localStorage.setItem('token'+cnt,newToken);
          this.message = 'Your email to reset password has been sent';
          console.log(success);
      },err=>console.log(err));
  }

}
