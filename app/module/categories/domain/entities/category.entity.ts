// Matches API response: { id, name, description, createdAt, updatedAt }
export class Category {
  constructor(
    public id: string,
    public name: string,
    public description: string = "",
    public createdAt: string = "",
    public updatedAt: string = "",
  ) {}
}
