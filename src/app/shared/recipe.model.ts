import { Ingredient } from './ingredient.model';

export class Recipe {
  name: string;
  description: string;
  imagePath: string;
  ingredients: Ingredient[];

  constructor(
    name: string,
    desc: string,
    imPath: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imPath;
    this.ingredients = ingredients;
  }
}
