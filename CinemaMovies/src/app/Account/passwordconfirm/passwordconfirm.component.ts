import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordModel } from 'src/app/models/resetPassword';
import { CryptService } from 'src/app/services/crypt.service';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-passwordconfirm',
  templateUrl: './passwordconfirm.component.html',
  styleUrls: ['./passwordconfirm.component.css']
})
export class PasswordconfirmComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: LoginServiceService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private crypService : CryptService
  ) { }

  userForm: FormGroup;
  passModel : ResetPasswordModel;

  messageValidate = {
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
    var exist = false;
    this.passModel ={
      id:'',
      token:'',
      password:''
    };
    this.activeRoute.queryParams.subscribe(pram => {
      this.passModel.id = pram['ID'];
      this.passModel.token = pram['Token'];
      if (this.passModel.id != null && this.passModel.token != null) {
        var keys = Object.keys(localStorage);
        keys.forEach(element => {
          if(element != null && element.includes('token')){
            var item = localStorage.getItem(element);
            if(item != null){
              var token = this.crypService.Decrypt(item);
              if(token === this.passModel.token){
                exist = true;
                return;
              }
            }
          }
        });
        if (!exist) {
          this.router.navigate(['home']).then(x => { window.location.reload(); });
        }
      }
      else {
        this.router.navigate(['home']).then(x => { window.location.reload(); });
      }
    }, ex => console.log(ex));
    this.userForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ResetPassword() {
    if(this.userForm.value.password !== null){
      this.passModel.password = this.userForm.value.password;
    }
    this.service.ResetPassord(this.passModel).subscribe(success=>{
      this.router.navigate(['login']);
    },err=>console.log(err));
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

}
