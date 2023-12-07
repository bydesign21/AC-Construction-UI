import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TableFormService {
  constructor(private fb: FormBuilder) {}

  createRowForm(item: any, formConfig: any): FormGroup {
    const group: any = {};
    Object.keys(formConfig).forEach(key => {
      const controlConfig = formConfig[key];
      const value = item[key] ?? controlConfig.defaultValue;
      group[key] = [value, controlConfig.validators];
    });
    return this.fb.group(group);
  }

  getFieldErrors(form: FormGroup): ValidationErrors {
    const errors: ValidationErrors = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors && !control.pristine) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  validateRow(form: FormGroup): boolean {
    return form?.valid;
  }

  getFormControl(row: FormGroup, controlName: string): FormControl {
    return row.get(controlName) as FormControl;
  }

  updateFieldErrors(
    form: FormGroup,
    errors: ValidationErrors[],
    rowIndex: number
  ): void {
    // Diagnostic logging

    if (!form || !errors || rowIndex < 0 || rowIndex >= errors.length) {
      console.error('Invalid form or rowIndex in updateFieldErrors');
      return;
    }

    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control && control.invalid) {
        errors[rowIndex][field] = this.getErrorMessage(
          control.errors || {},
          field
        );
      } else {
        errors[rowIndex][field] = null;
      }
    });
  }

  private getErrorMessage(errors: ValidationErrors, fieldName: string): string {
    if (errors.required) {
      return `This field is required`;
    } else if (errors.min) {
      return `This field must be greater than ${errors.min.min}`;
    } else if (errors.max) {
      return `This field must be less than ${errors.max.max}`;
    }
    // Add more error types as needed
    return `Error in ${fieldName}`;
  }
}
