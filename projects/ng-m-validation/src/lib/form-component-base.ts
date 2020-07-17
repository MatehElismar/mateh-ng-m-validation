import { ViewChildren, ElementRef, QueryList, OnDestroy } from "@angular/core";
import {
  FormControlName,
  FormGroup,
  FormArray,
  ValidatorFn,
  ValidationErrors,
  FormControl,
} from "@angular/forms";
import { Observable, fromEvent, merge, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

export class FormComponentBase implements OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: QueryList<ElementRef>;

  public validationMessages: {
    [key: string]: { [key: string]: string };
  } = {};
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

  showErrors(group: FormGroup) {
    for (const c of Object.keys(group.controls)) {
      const b = group.get(c);
      if (!b.valid) {
        b.markAsDirty();
        b.markAsTouched();
        b.updateValueAndValidity();
      }
    }
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

  cedulaValidator(formControl: FormControl) {
    const cedula = formControl.value;
    if (cedula) {
      let rootCedula = cedula.trim();

      let str1 = rootCedula.substr(0, 3);
      let str2 = rootCedula.substr(4, 7);
      let str3 = rootCedula.substr(12, 1);
      let fixedCedula = str1.concat(str2, str3);

      let numeroCed = fixedCedula;

      for (let f = 0; f < numeroCed.length; f++) {}

      let cPrimerNumero = numeroCed[0] * 1;
      let cSegundoNumero = numeroCed[1] * 2;
      let cTercerNumero = numeroCed[2] * 1;
      let cCuartoNumero = numeroCed[3] * 2;
      let cQuintoNumero = numeroCed[4] * 1;
      let cSextoNumero = numeroCed[5] * 2;
      let cSeptimoNumero = numeroCed[6] * 1;
      let cOctavoNumero = numeroCed[7] * 2;
      let cNovenoNumero = numeroCed[8] * 1;
      let cDecimoNumero = numeroCed[9] * 2;
      let digitoVerificador = parseInt(numeroCed[10]);

      if (cPrimerNumero > 9) {
        cPrimerNumero = cPrimerNumero - 9;
      }
      if (cSegundoNumero > 9) {
        cSegundoNumero = cSegundoNumero - 9;
      }
      if (cTercerNumero > 9) {
        cTercerNumero = cTercerNumero - 9;
      }
      if (cCuartoNumero > 9) {
        cCuartoNumero = cCuartoNumero - 9;
      }
      if (cQuintoNumero > 9) {
        cQuintoNumero = cQuintoNumero - 9;
      }
      if (cSextoNumero > 9) {
        cSextoNumero = cSextoNumero - 9;
      }
      if (cSeptimoNumero > 9) {
        cSeptimoNumero = cSeptimoNumero - 9;
      }
      if (cOctavoNumero > 9) {
        cOctavoNumero = cOctavoNumero - 9;
      }
      if (cNovenoNumero > 9) {
        cNovenoNumero = cNovenoNumero - 9;
      }
      if (cDecimoNumero > 9) {
        cDecimoNumero = cDecimoNumero - 9;
      }

      let sumaPares =
        cSegundoNumero +
        cCuartoNumero +
        cSextoNumero +
        cOctavoNumero +
        cDecimoNumero;
      let sumaImpares =
        cPrimerNumero +
        cTercerNumero +
        cQuintoNumero +
        cSeptimoNumero +
        cNovenoNumero;
      let sumaParesImpares = sumaPares + sumaImpares;
      let sumaDecena = Math.ceil(sumaParesImpares) * 10;
      sumaParesImpares = sumaDecena - sumaParesImpares;

      let cadenaSumaParesImpares = sumaParesImpares.toString();

      for (let j = 0; j < cadenaSumaParesImpares.length; j++) {}

      let g = cadenaSumaParesImpares.trim();
      let w = cadenaSumaParesImpares[2];

      if (parseInt(w) == digitoVerificador) {
        return null;
      } else {
        return { cedula: true };
      }
    }
  }

  ngOnDestroy() {
    this.mySubs.unsubscribe();
  }
}
