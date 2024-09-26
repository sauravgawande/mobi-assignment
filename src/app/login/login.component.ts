import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserRole } from '../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  users: { email: string; password: string; role: string }[] = [];
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.users = this.authService.fetchAllUsers();
  }

  //Submit login form
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email, password)
        .pipe(
          tap((user) => {
            if (user) {
              this.redirectToDashboard(user.role, user.id);
            } else {
              alert('Invalid credentials');
            }
          })
        )
        .subscribe();
    } else {
      console.log('Form is invalid:', this.loginForm.errors);
    }
  }

  //redirect user to there respective dashboards::
  redirectToDashboard(role: UserRole, id: string): void {
    const routes: { [key in UserRole]: string } = {
      [UserRole.SUPER_USER]: `/super-user-dashboard/${id}`,
      [UserRole.ADMIN]: `/admin-dashboard/${id}`,
      [UserRole.USER]: `/user-dashboard/${id}`,
    };

    this.router.navigate([routes[role] || '/']);
  }
}
