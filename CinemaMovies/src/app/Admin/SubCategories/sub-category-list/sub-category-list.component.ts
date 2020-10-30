import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubCategory } from 'src/app/models/SubCategory';
import { AdminService } from 'src/app/services/admin.service';
import { SubCategoryComponent } from '../sub-category/sub-category.component';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit {

  constructor(
    private service: AdminService,
    private router: Router
    ) { }

  subCategories: SubCategory[];
  currentSubCategory :SubCategory;
  ngOnInit() {
    this.subCategories = null;
    this.currentSubCategory = null;
    this.getSubCategories();
  }
  getSubCategories() {
    this.service.GetAllSubCategories().subscribe(list => {
      this.subCategories = list;
    }, ex => console.log(ex));
  }

  SelectDeleteSubCategory(item : SubCategory){
    this.currentSubCategory = item;
  }
  EditSubCategory(id: number, catName: string, catId: number) {
    if (id) {
      this.router.navigate(['/editsubcategory', id, catName, catId]);
    }
  }

  AddSubCategory() {
    this.router.navigate(['subcategory']);
  }

  DeleteSubCategory(){
    this.service.DeleteSubCategory(this.currentSubCategory).subscribe(success=>{
      sessionStorage.setItem('subcat','subcat');
      this.router.navigate(['/controlpanel']).then(x=>{window.location.reload()});
    },err=>console.log(err));
  }
}
