import { Component, OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AlertService, AuthenticationService } from '../_services';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;

    this.authenticationService
      .login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.toastr.success('Logged in successfully.');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error.error.error?error.error.error:error.message);
          this.loading = false;
        });
  }
}
