import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeGuard } from './recipe.guard';
import { RecipeResovler } from './recipe.resolver';
import { RecipesComponent } from './recipes.component';

export const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [RecipeGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipeResovler],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipeResovler],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
