export type UserRole = "EDITOR" | "SUPER_ADMIN";

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: UserRole,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
