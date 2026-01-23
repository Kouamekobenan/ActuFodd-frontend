import { Post } from "../../../post/domain/entities/post";

export class Category {
  constructor(
    public _id: string,
    public _name: string,
    public _description: string,
    public _posts: Post[] = [],
    public _createdAt: Date,
    public _updatedAt: Date,
  ) {}
}

export class Categorie {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public posts: any[] = [],
    public createdAt: Date,
    public pdatedAt: Date,
  ) {}
}