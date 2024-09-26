import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  userId!: string | null;
  users: any;
  constructor(private snackBar: MatSnackBar, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  user: any;
  loginedInUserObj: any;

  ngOnInit() {
    this.users = this.authService.fetchAllUsers();
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
    this.loginedInUserObj = this.users.find((x: any) => x.id === this.userId);
    console.log(this.loginedInUserObj);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
