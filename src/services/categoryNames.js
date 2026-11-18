// Tradução dos nomes das categorias que a API devolve em inglês.
const NAMES = {
  Beef: 'Carne',
  Breakfast: 'Café da manhã',
  Chicken: 'Frango',
  Dessert: 'Sobremesa',
  Goat: 'Cabrito',
  Lamb: 'Cordeiro',
  Miscellaneous: 'Diversos',
  Pasta: 'Massas',
  Pork: 'Porco',
  Seafood: 'Frutos do mar',
  Side: 'Acompanhamento',
  Starter: 'Entrada',
  Vegan: 'Vegano',
  Vegetarian: 'Vegetariano',
};

export function translateCategory(category) {
  return NAMES[category] ?? category;
}
