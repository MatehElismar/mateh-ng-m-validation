import { ViewChildren, ElementRef, QueryList, OnDestroy } from "@angular/core";
import {
  FormControlName,
  FormGroup,
  FormArray,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable, fromEvent, merge, Subscriber, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

export class FormComponentBase implements OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<ElementRef>;

  public validationMessages: { [key: string]: { [key: string]: string } } = {};
  public formErrors: { [key: string]: string } = {};

  mySubs: Subscription;

  protected startControlMonitoring(
    form: FormGroup,
    unsubscribePreviousForm = false
  ): void {
    if (unsubscribePreviousForm) {
      this.mySubs.unsubscribe();
    }
    // Watch for the blur event from any input element on the form.
    //  This is required because the valueChanges does not provide notification on blur.
    this.subscribe(form, this.formInputElements.toArray());

    this.formInputElements.changes.subscribe(
      (inputs: QueryList<ElementRef>) => {
        this.subscribe(form, inputs.toArray());
      }
    );
  }

  private subscribe(form: FormGroup, inputsArray: ElementRef[]) {
    // console.log(inputsArray);
    const controlBlurs: Observable<
      any
    >[] = inputsArray.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, "blur")
    );

    // Merge the blur event observable with the valueChanges observable so we only need to subscribe once.
    this.mySubs = merge(form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.logValidationErrors(form);
      });
  }

  private logValidationErrors(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = "";
      // console.log(key, abstractControl.invalid, abstractControl.touched, abstractControl.dirty);
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + " ";
          }
        }
      }
      // console.log(this.formErrors);
      if (
        abstractControl instanceof FormGroup ||
        abstractControl instanceof FormArray
      ) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  atLeastOneCheckboxCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup | FormArray) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.controls[key];

        if (control.value) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }

  passwordsMustMatchValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const currentPassword = group.get("password");
      const newPassword = group.get("confirmPassword");

      if (currentPassword && newPassword) {
        if (currentPassword.pristine || newPassword.pristine) {
          return null;
        }
        if (currentPassword.value !== newPassword.value) {
          return { passwordsMustMatch: true };
        }
      }
      return null;
    };
  }

  ngOnDestroy() {
    this.mySubs.unsubscribe();
  }
}
