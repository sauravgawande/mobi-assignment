export enum UserRole {
    SUPER_USER = 'super-user',
    ADMIN = 'admin',
    USER = 'user',
}


export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    department: string;
    salary: number;
    bankAccount: string;
    id: string;
    taxDeduction: number,
    healthInsurance: number,
    bonus: number,
}