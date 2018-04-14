import {AbstractControl} from '@angular/forms';
import { FormControl } from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

export class PasswordValidation {

  public static MatchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let confirmPassword = control.get('confirmPassword').value;
    if(password != confirmPassword) {
      control.get('confirmPassword').setErrors( {MatchPassword: true} );
    } else {
      return null;
    }
  }

	public static strong(control: FormControl): ValidationResult {
    let hasNumber = /\d/.test(control.value);
    let hasUpper = /[A-Z]/.test(control.value);
    let hasLower = /[a-z]/.test(control.value);
    let hasSpecial = /[!@#$%^&*()]/.test(control.value);
    const valid = hasNumber && (hasUpper || hasLower) && hasSpecial;
    if (!valid) {
      return { strong: true };
    }
    return null;
  }
}