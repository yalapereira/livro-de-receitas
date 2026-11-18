# Livro de Receitas 🍳

App feito com **React Native + Expo** para o Trabalho Final de Desenvolvimento Mobile.

Ele busca receitas na API pública [TheMealDB](https://www.themealdb.com/api.php), mostra as receitas por categoria em uma lista com busca, abre os detalhes de cada receita e guarda as **receitas favoritas** no celular com AsyncStorage.

## Como rodar

```bash
npm install
npx expo start
```

Depois é só ler o QR Code com o app **Expo Go** no celular (ou apertar `a` para abrir no emulador Android).

## Telas

| Tela | Arquivo | O que faz |
|---|---|---|
| Receitas | `src/app/(tabs)/index.js` | Lista as receitas da categoria escolhida, com busca pelo nome e puxar para recarregar |
| Detalhes | `src/app/receita/[id].js` | Recebe o `id` pela rota, busca a receita completa, mostra ingredientes e preparo, favoritar e compartilhar |
| Favoritas | `src/app/(tabs)/favoritos.js` | Lista as receitas salvas no celular |
| Ajustes | `src/app/(tabs)/configuracoes.js` | Tema claro/escuro (salvo) e botão para limpar favoritas |

## Estrutura do código

```
src/
├── app/                      # Telas (Expo Router: cada arquivo é uma rota)
│   ├── _layout.js            # Layout raiz: contextos + Stack
│   ├── (tabs)/_layout.js     # Barra de abas
│   ├── (tabs)/index.js       # Lista de receitas
│   ├── (tabs)/favoritos.js   # Favoritas
│   ├── (tabs)/configuracoes.js
│   └── receita/[id].js       # Detalhes (rota dinâmica)
├── components/               # Componentes reutilizáveis
│   ├── MealCard.js           # Item da lista
│   ├── SearchBar.js          # Campo de busca
│   ├── CategoryFilter.js     # Botões de categoria
│   ├── StatusMessage.js      # Carregando / erro / lista vazia
│   └── PrimaryButton.js      # Botão grande para toque
├── context/
│   ├── FavoritesContext.js   # Favoritas + AsyncStorage
│   └── ThemeContext.js       # Tema claro/escuro + AsyncStorage
├── services/
│   ├── mealApi.js            # Chamadas à API (fetch + async/await)
│   └── categoryNames.js      # Tradução das categorias
└── theme/colors.js           # Cores dos temas
```

## Requisitos do trabalho → onde estão no código

### Obrigatórios

- **Consumo de API** — `src/services/mealApi.js`: `fetch` com `async/await`; se `response.ok` for falso, lança erro. Nas telas, a chamada fica dentro de `try/catch` (`loadMeals` em `index.js`, `loadMeal` em `[id].js`).
- **Estados da requisição** — estados `loading` e `error`. Enquanto carrega aparece o `ActivityIndicator` (componente `StatusMessage`); se der erro aparece uma mensagem amigável e o botão "Tentar de novo".
- **Busca no momento certo** — `useEffect(() => { loadCategories(); }, [])` roda quando a tela abre; `useEffect(..., [selectedCategory])` busca as receitas ao abrir e sempre que a categoria muda.
- **Lista** — `FlatList` com `keyExtractor={(item) => item.idMeal}` e `ListEmptyComponent` para lista vazia.
- **Busca ou filtro** — campo de busca (`SearchBar`) que filtra pelo nome enquanto digita (`meals.filter(...)`) e botões de categoria (`CategoryFilter`) que buscam outra categoria na API.
- **Navegação** — 4 telas com Expo Router: abas (Receitas, Favoritas, Ajustes) + Stack com a tela de detalhes.
- **Passagem de dados** — ao tocar num item: `router.push(`/receita/${item.idMeal}`)`. Na tela de detalhes: `const { id } = useLocalSearchParams();`.
- **Estado e eventos (sem mutar o array)** — em `FavoritesContext.js`:
  - adicionar: `setFavorites((current) => [...current, item])`
  - remover: `setFavorites((current) => current.filter((meal) => meal.idMeal !== id))`
- **Armazenamento local** — `FavoritesContext.js` lê as favoritas com `AsyncStorage.getItem` ao abrir o app e salva com `AsyncStorage.setItem` sempre que a lista muda (`JSON.stringify` / `JSON.parse`).
- **Interface** — `StyleSheet.create` em todos os componentes, `SafeAreaView` (de `react-native-safe-area-context`) em todas as telas e botões com no mínimo 44–48 px de altura.

### Extras

- **Puxar para recarregar** — `refreshing` e `onRefresh` na `FlatList` da tela inicial.
- **Recurso nativo** — botão "Compartilhar" nos detalhes usa `Share.share()` (menu de compartilhamento do celular).
- **Configurações salvas** — tema claro/escuro em `ThemeContext.js`, salvo no AsyncStorage.

## Roteiro para a apresentação

1. Abrir o app, trocar a categoria, buscar uma receita pelo nome.
2. Puxar a lista para baixo (recarrega).
3. Tocar numa receita → detalhes → **Favoritar** e **Compartilhar**.
4. Ir em **Favoritas** e mostrar a receita salva; ir em **Ajustes** e ligar o tema escuro.
5. **Fechar o app de verdade e abrir de novo**: as favoritas e o tema continuam lá.

### Fluxo dos dados (para explicar o código)

```
Tela abre → useEffect → loadMeals() → fetchMealsByCategory() (fetch na API)
   → setMeals(data) → FlatList re-renderiza com os dados
   → toque no item → router.push('/receita/ID') → useLocalSearchParams() lê o id
   → fetchMealById(id) → mostra os detalhes
   → Favoritar → addFavorite (spread) → useEffect salva no AsyncStorage
```

### Alterações rápidas que podem ser pedidas

- **Mudar a categoria inicial:** em `index.js`, `useState('Chicken')` → por exemplo `useState('Dessert')`.
- **Mudar a mensagem de lista vazia:** prop `message` do `ListEmptyComponent` em `index.js` ou `favoritos.js`.
- **Buscar também pelo começo do nome:** trocar `.includes(...)` por `.startsWith(...)` no `filteredMeals`.
- **Mudar a cor principal:** `primary` em `src/theme/colors.js`.
- **Mostrar quantos favoritos existem no título:** já está no subtítulo de `favoritos.js` (`favorites.length`).
