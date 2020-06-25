import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad,Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../@service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor( private router: Router,
    private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
            if (currentUser && currentUser.isadmin) {
                // logged in so return true
                
                return false;
            }
            return true;
      }

}
