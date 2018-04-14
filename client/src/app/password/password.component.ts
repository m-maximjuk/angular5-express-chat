import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';

import { AlertService, AuthenticationService } from '../_services';
import { PasswordValidation } from '../_helpers';

@Component({
  moduleId: module.id,
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  model: any = {};
  loading = false;
  form: FormGroup;

  public barLabel: string = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
	public account = {
     password: <string>null
  };

  constructor(
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastr: ToastsManager
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      oldPassword: [null, [Validators.required,]],
      password: [null, [Validators.required, Validators.minLength(6), PasswordValidation.strong]],
      confirmPassword: [null, [Validators.required,]],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  get oldPassword() { return this.form.get('oldPassword'); }

  get password() { return this.form.get('password'); }

  get confirmPassword() { return this.form.get('confirmPassword'); }

  passwordReset() {
    this.loading = true;

    this.authenticationService
      .resetPwd(this.form.value.oldPassword, this.form.value.password)
      .subscribe(
        data => {
          this.toastr.success('Password updated successfully.');
          this.router.navigate(['/']);
          this.form.reset();
        },
        error => {
          this.alertService.error(error.error.error?error.error.error:error.message);
          this.loading = false;
        });
  }
}
