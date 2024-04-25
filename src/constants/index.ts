export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_BASE_URL = process.env.DB_BASE_URL;
export const GUEST_PASSWORD = process.env.GUEST_PASSWORD;
export const CUSTOMER_PASSWORD = process.env.CUSTOMER_PASSWORD;
export const EMPLOYEE_PASSWORD = process.env.EMPLOYEE_PASSWORD;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export enum DB_ROLES {
  Guest = 'guest',
  Customer = 'customer',
  Employee = 'employee',
  Admin = 'admin',
}

export enum DB_ROLES_ID {
  Guest = 1,
  Customer,
  Employee,
  Admin,
}
