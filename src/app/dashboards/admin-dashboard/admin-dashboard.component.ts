import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[0-9]*$/.test(control.value);
    return valid ? null : { notANumber: { value: control.value } };
  };
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  payrollFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.thirdFormGroup = this._formBuilder.group({
      role: ['', Validators.required],
      department: ['', Validators.required],
    });

    this.payrollFormGroup = this._formBuilder.group({
      salary: ['', [Validators.required, numberValidator()]],
      bankAccount: ['', [Validators.required, numberValidator()]],
      taxDeduction: ['', [Validators.required, numberValidator()]],
      healthInsurance: ['', [Validators.required, numberValidator()]],
      bonus: ['', [Validators.required, numberValidator()]],
    });
  }

  onSubmit() {
    if (
      this.firstFormGroup.invalid ||
      this.secondFormGroup.invalid ||
      this.thirdFormGroup.invalid ||
      this.payrollFormGroup.invalid
    ) {
      this.firstFormGroup.markAllAsTouched();
      this.secondFormGroup.markAllAsTouched();
      this.thirdFormGroup.markAllAsTouched();
      this.payrollFormGroup.markAllAsTouched();
      return;
    }

    const userData = {
      id: uuidv4(),
      firstName: this.firstFormGroup.value.firstName,
      lastName: this.firstFormGroup.value.lastName,
      email: this.secondFormGroup.value.email,
      phone: this.secondFormGroup.value.phone,
      password: this.secondFormGroup.value.password,
      role: this.thirdFormGroup.value.role,
      department: this.thirdFormGroup.value.department,
      salary: this.payrollFormGroup.value.salary,
      bankAccount: this.payrollFormGroup.value.bankAccount,
      taxDeduction: this.payrollFormGroup.value.taxDeduction,
      healthInsurance: this.payrollFormGroup.value.healthInsurance,
      bonus: this.payrollFormGroup.value.bonus,
    };

    this.authService.addUser(userData);
    this.openSnackBar('User successfully added!', 'Close');
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.payrollFormGroup.reset();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
