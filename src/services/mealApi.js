// Funções que conversam com a API TheMealDB (https://www.themealdb.com/api.php).
// Todas usam fetch com async/await e lançam um erro se a resposta não vier OK.
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar a API`);
  }
  return response.json();
}

// Lista de categorias (Beef, Chicken, Dessert...)
export async function fetchCategories() {
  const data = await getJson('/categories.php');
  return data.categories ?? [];
}

// Receitas de uma categoria: cada item tem idMeal, strMeal e strMealThumb
export async function fetchMealsByCategory(category) {
  const data = await getJson(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals ?? [];
}

// Detalhes completos de uma receita pelo id
export async function fetchMealById(id) {
  const data = await getJson(`/lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals ? data.meals[0] : null;
}

// A API devolve os ingredientes em campos strIngredient1..20 e strMeasure1..20.
// Esta função junta tudo numa lista mais fácil de mostrar.
export function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure ? measure.trim() : '' });
    }
  }
  return ingredients;
}
