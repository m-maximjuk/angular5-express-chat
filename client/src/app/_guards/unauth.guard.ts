import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authenticationService.isAuthenticated()) {
      // not logged in so return true
      return true;
    }

    // logged in so redirect to '/' page
    this.router.navigate(['/']);
    return false;
  }
}
