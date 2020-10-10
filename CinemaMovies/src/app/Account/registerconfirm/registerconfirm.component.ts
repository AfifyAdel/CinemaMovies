import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterServiceService } from 'src/app/services/register-service.service';

@Component({
  selector: 'app-registerconfirm',
  templateUrl: './registerconfirm.component.html',
  styleUrls: ['./registerconfirm.component.css']
})
export class RegisterconfirmComponent implements OnInit {

  constructor(
    private activeRoute : ActivatedRoute,
    private service : RegisterServiceService
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(pram=>{
      const id = pram['ID'];
      const token  = pram['Token'];
      if(id != null && token !=null){
          this.service.RegisterConfirmation(id,token).subscribe(success=>{
            console.log(success);
          },err=>console.log(err));
      }
    },ex=>console.log(ex));
  }

}
