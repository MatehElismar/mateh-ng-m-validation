import { Component, AfterViewInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { FormComponentBase } from "projects/ng-m-validation/src/public-api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent extends FormComponentBase implements AfterViewInit {
  title = "demo-sandbox";

  form: FormGroup;

  validationMessages = {
    name: { required: "Name is required" },
    email: {
      required: "email is required",
      email: "email is not well-formated",
    },
    cedula: { required: "Cedula is required", cedula: "Invalid cedula" },
  };

  formErrors = {};

  constructor(fb: FormBuilder) {
    super();
    this.form = fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      cedula: ["", [Validators.required, this.cedulaValidator]],
    });
  }

  ngAfterViewInit() {
    this.startControlMonitoring(this.form);
  }
}
