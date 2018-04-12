import { Component, OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AlertService, AuthenticationService } from '../_services';
import { PasswordValidation } from '../_helpers';

@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required, Validators.minLength(3),]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  get email() { return this.form.get('email'); }

  get username() { return this.form.get('username'); }

  get password() { return this.form.get('password'); }

  get confirmPassword() { return this.form.get('confirmPassword'); }

  register() {
    this.loading = true;

    this.authenticationService
      .register(this.form.value)
      .subscribe(
        data => {
          this.toastr.success('Registered successfully.');
          this.router.navigate(['/']);
          this.form.reset();
        },
        error => {
          this.alertService.error(error.error.error?error.error.error:error.message);
          this.loading = false;
        });
  }
}
