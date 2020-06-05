import { ErrorStateMatcher } from "@angular/material/core/error/error-options";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { Component } from "@angular/core";

// @Component({
//   template: ``,
// })
export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    if (control) {
      return (control.dirty || control.touched) && control.parent.invalid;
    }
    return false;
  }
}
