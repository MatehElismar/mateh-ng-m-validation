import { NgModule } from "@angular/core";
import { NgMValidationComponentBase } from "./ng-m-validation.component";
// import { CrossFieldErrorMatcher } from "./cross-field-error-matcher";
// import { FormComponentBase } from "./form-component-base";

@NgModule({
  declarations: [
    NgMValidationComponentBase,
    // CrossFieldErrorMatcher,
    // FormComponentBase,
  ],
  imports: [],
  exports: [
    NgMValidationComponentBase,
    // CrossFieldErrorMatcher,
    // FormComponentBase,
  ],
})
export class NgMValidationModule {}
