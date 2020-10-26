import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuardService implements CanActivate {

  constructor(private authservice: AuthService, private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const email = !!localStorage.getItem('email');
    const role = !!localStorage.getItem('role');
    var roleName = this.authservice.role;
    if (role) {
      if (roleName.toLowerCase() !== "admin") {
        this.router.navigate(['accessdenied']).then(x => { window.location.reload() });
      }
      return true;
    }
    else {
      if (!email || !role) {
        this.router.navigate(['notfound']).then(x => { window.location.reload() });
      }
    }
    return false;
  }
}
