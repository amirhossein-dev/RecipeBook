import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '..//recipes/store/recipes.reducer';

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const AppReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.ShoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.RecipesReducer,
};
