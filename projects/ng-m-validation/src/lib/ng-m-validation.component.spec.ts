import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NgMValidationComponentBase } from "./ng-m-validation.component";

describe("NgMValidationComponentBase", () => {
  let component: NgMValidationComponentBase;
  let fixture: ComponentFixture<NgMValidationComponentBase>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgMValidationComponentBase],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgMValidationComponentBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
