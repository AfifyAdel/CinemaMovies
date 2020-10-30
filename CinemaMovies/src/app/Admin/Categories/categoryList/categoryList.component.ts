import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/CategoryModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-categoryList',
  templateUrl: './categoryList.component.html',
  styleUrls: ['./categoryList.component.css']
})
export class CategoryListComponent implements OnInit {

  constructor(
    private service : AdminService,
    private router : Router
  ) { }

  categories : Category[];
  currentCategory : Category;
  ngOnInit() {
    this.categories = [];
    this.currentCategory = {
      categoryName :'',
      id : 0
    };
    this.GetCategoris();
  }

  GetCategoris(){
    this.service.GetAllCategories().subscribe(success=>{
      this.categories = success;
    },err=>console.log(err));
  }

  AddCategory(){
    this.router.navigate(['/addcategory']);
  }

  EditCategory(id : number){
    this.router.navigate(['/editcategory',id]);
  }

  SelectDeleteCategory(item : Category){
    this.currentCategory = item;
  }
  DeleteCategory(){
    this.service.DeleteCategory(this.currentCategory).subscribe(success=>{
      sessionStorage.setItem('cat','cat');
      this.router.navigate(['/controlpanel']).then(x=>{window.location.reload()});
    },err=>console.log(err));
  }

}
