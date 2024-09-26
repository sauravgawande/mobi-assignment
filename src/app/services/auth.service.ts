import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor() {}

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private isSessionStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.sessionStorage;
  }

  private getUsers(): User[] {
    if (this.isLocalStorageAvailable()) {
      const storedUsers = localStorage.getItem(this.usersKey);
      console.log('Users retrieved from local storage:', storedUsers);
      return storedUsers ? JSON.parse(storedUsers) : this.getDefaultUsers();
    } else {
      return this.getDefaultUsers();
    }
  }

// Get default users
  private getDefaultUsers(): User[] {
    return [
      {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: '123456',
        phone: '1234567890',
        role: UserRole.ADMIN,
        department: 'Finance',
        salary: 40000,
        bankAccount: '987654321',
        taxDeduction: 20,
        healthInsurance: 34,
        bonus: 54,
      },
    ];
  }

  // This is a function to Login users
  login(email: string, password: string): Observable<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const user = this.getUsers().find((u) => {
      const storedEmail = u.email.trim().toLowerCase();
      const storedPassword = u.password.trim();
      return (
        storedEmail === normalizedEmail && storedPassword === normalizedPassword
      );
    });

    if (user && this.isSessionStorageAvailable()) {
      sessionStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
      return of(user);
    } else {
      return of(null);
    }
  }

  isLoggedIn(): boolean {
    return (
      this.isSessionStorageAvailable() &&
      !!sessionStorage.getItem(this.loggedInUserKey)
    );
  }

  getUserRole(): UserRole | null {
    const user = this.getLoggedInUser();
    return user ? user.role : null;
  }

  getUserId(): string | null {
    const user = this.getLoggedInUser();
    return user ? user.id : null;
  }

  private getLoggedInUser(): User | null {
    if (!this.isSessionStorageAvailable()) {
      return null;
    }
    const storedUser = sessionStorage.getItem(this.loggedInUserKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Logou the current users
  logout(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.loggedInUserKey);
    }
  }



// This is fnction to add new users::
  addUser(user: User): void {
    const normalizedEmail = user.email.trim().toLowerCase();

    const newUser: User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: normalizedEmail,
      password: user.password,
      phone: user.phone,
      role: user.role,
      department: user.department,
      salary: user.salary,
      bankAccount: user.bankAccount,
      taxDeduction: user.taxDeduction,
      healthInsurance: user.healthInsurance,
      bonus: user.bonus,
    };

    const updatedUsers = [...this.getUsers(), newUser];
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.usersKey, JSON.stringify(updatedUsers));
    }
  }

  fetchAllUsers(): User[] {
    return this.getUsers();
  }
}
