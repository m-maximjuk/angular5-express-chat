import { Component } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthenticationService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chat';

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  logout() {
    this.toastr.success('Logged out successfully.');
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
