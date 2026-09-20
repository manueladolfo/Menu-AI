import type { Recipe } from '../types';
import { LEGUME_RECIPES } from './recipes/legumes';
import { FISH_RECIPES } from './recipes/fish';
import { MEAT_RECIPES } from './recipes/meats';
import { PASTA_RECIPES } from './recipes/pastas';
import { STEW_RECIPES } from './recipes/stews';
import { EGG_RECIPES } from './recipes/eggs';
import { SOUP_RECIPES } from './recipes/soups';
import { FAST_FOOD_RECIPES } from './recipes/fastFood';
import { EMPANADA_RECIPES } from './recipes/empanadas';
import { VEGETABLE_RECIPES } from './recipes/vegetables';
import { SAUCE_RECIPES } from './recipes/sauces';

export const INITIAL_RECIPES: Recipe[] = [
  ...LEGUME_RECIPES,
  ...FISH_RECIPES,
  ...MEAT_RECIPES,
  ...PASTA_RECIPES,
  ...STEW_RECIPES,
  ...EGG_RECIPES,
  ...SOUP_RECIPES,
  ...FAST_FOOD_RECIPES,
  ...EMPANADA_RECIPES,
  ...VEGETABLE_RECIPES,
  ...SAUCE_RECIPES,
];

export {
  LEGUME_RECIPES,
  FISH_RECIPES,
  MEAT_RECIPES,
  PASTA_RECIPES,
  STEW_RECIPES,
  EGG_RECIPES,
  SOUP_RECIPES,
  FAST_FOOD_RECIPES,
  EMPANADA_RECIPES,
  VEGETABLE_RECIPES,
  SAUCE_RECIPES,
};
