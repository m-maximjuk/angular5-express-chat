import {AbstractControl} from '@angular/forms';
import { FormControl } from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true} )
    } else {
      return null
    }
  }

	public static strong(control: FormControl): ValidationResult {
    let hasNumber = /\d/.test(control.value);
    let hasUpper = /[A-Z]/.test(control.value);
    let hasLower = /[a-z]/.test(control.value);
    let hasSpecial = /[!@#$%^&*()]/.test(control.value);
    const valid = hasNumber && (hasUpper || hasLower) && hasSpecial;
    if (!valid) {
      // return what´s not valid
      return { strong: true };
    }
    return null;
  }
}