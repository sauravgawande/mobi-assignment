import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SuperAdminComponent } from './dashboards/super-admin/super-admin.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { authGuard, loginGuard } from './auth-guard/auth.guard';
import { UserRole } from './interfaces/user';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    {
        path: 'super-user-dashboard/:id',
        component: SuperAdminComponent,
        canActivate: [authGuard],
        data: { role: UserRole.SUPER_USER },
    },
    {
        path: 'admin-dashboard/:id',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: UserRole.ADMIN },
    },
    {
        path: 'user-dashboard/:id',
        component: UserDashboardComponent,
        canActivate: [authGuard],
        data: { role: UserRole.USER },
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
];
