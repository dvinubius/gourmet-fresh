import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromRecipes from '../store/recipe.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  index: number;
  editMode = false; // component checks whether it's editing an existing recipe or creating a new one
  recipeForm: FormGroup;
  triedSubmit = false;
  imagePath: string;
  anyIngredients = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRecipes.FeatureState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((par) => {
      this.index = +par['id'];
      this.editMode = par['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let name = '';
    let description = '';
    let imagePath = '';
    const ingredientsArray = new FormArray([]);

    if (this.editMode) {
      this.store
        .pipe(select('recipes'), take(1))
        .subscribe((recipesState: fromRecipes.State) => {
          const recipe = recipesState.recipes[this.index];
          name = recipe.name;
          description = recipe.description;
          imagePath = recipe.imagePath;
          recipe.ingredients.forEach((ing) => {
            const group = new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            });
            ingredientsArray.push(group);
          });
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      description: new FormControl(description, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      ingredients: ingredientsArray,
    });

    this.changedIngredients();
  }

  getControls(): FormArray {
    return <FormArray>this.recipeForm.get('ingredients');
  }

  addIngredientClicked() {
    const ing = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
    (<FormArray>this.recipeForm.get('ingredients')).push(ing);
    this.changedIngredients();
  }

  removeIngredientClicked(index) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    this.changedIngredients();
  }

  onSubmit() {
    this.triedSubmit = true;
    if (!this.recipeForm.valid) {
      return;
    }

    const recipeVal = this.recipeForm.value;
    if (this.editMode) {
      // update edited Ingredient
      this.store.dispatch(
        new fromRecipes.UpdateRecipe({ index: this.index, recipe: recipeVal })
      );
    } else {
      // add new Ingredient
      this.store.dispatch(new fromRecipes.AddRecipe(recipeVal));
    }

    // navigate away, comes a better day
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancelClicked() {
    // away, away, of we go, yay
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  changedIngredients() {
    if ((<FormArray>this.recipeForm.get('ingredients')).length > 0) {
      this.anyIngredients = true;
    } else {
      this.anyIngredients = false;
    }
  }
}
