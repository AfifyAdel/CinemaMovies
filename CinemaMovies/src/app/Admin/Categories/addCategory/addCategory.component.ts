import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/CategoryModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-addCategory',
  templateUrl: './addCategory.component.html',
  styleUrls: ['./addCategory.component.css']
})
export class AddCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private router : Router,
    private activeRoute: ActivatedRoute
  ) { }

  catForm: FormGroup;
  message = '';
  title: string;
  btnTitle: string;
  isEditMode: boolean;
  category : Category;
  ngOnInit() {
    this.title = 'Add Category';
    this.btnTitle =  'Add Category';
    this.isEditMode = false;
    this.catForm = this.fb.group({
      categoryName : ['',Validators.required]
    });
    this.category = {
      categoryName : '',
      id : 0
    };
    this.activeRoute.paramMap.subscribe(param => {
      var id = param.get('id');
      if (id != null) {
        this.isEditMode = true;
        this.btnTitle = 'Save Changes';
        this.title = 'Edit Category';
        this.isEditMode = true;
        this.service.GetCategory(id).subscribe(success => {
          this.category = success;
          this.catForm.patchValue({
            categoryName: success.categoryName
          })
        }, err => console.log(err));
      }
    })
  }

  AddCategory(){
    if(this.isEditMode){
      this.category.categoryName = this.catForm.value.categoryName;
      this.service.EditCategory(this.category).subscribe(success=>{
        this.GoToCategories();
      },err=>{console.log(err),this.message=''});
    }
    else{
      this.category.categoryName = this.catForm.value.categoryName;
      this.service.AddCategory(this.category).subscribe(success=>{
        this.message = 'Category added successfully'
        this.catForm.reset();
      },err=>{console.log(err),this.message=''});
    }
  }
  GoToCategories(){
    sessionStorage.setItem('cat','cat');
    this.router.navigate(['/controlpanel']);
  }
}
