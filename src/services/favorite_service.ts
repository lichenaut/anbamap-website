export function addToFavorites(code: string) {
  let item: string | null = localStorage.getItem("favorites");
  if (item === null) {
    localStorage.setItem("favorites", JSON.stringify([code]));
    return;
  }

  let favorites: string[] = JSON.parse(item) || [];
  if (!favorites.includes(code)) {
    favorites.push(code);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

export function removeFromFavorites(code: string) {
  let item: string | null = localStorage.getItem("favorites");
  if (item === null) {
    return;
  }

  let favorites: string[] = JSON.parse(item) || [];
  favorites = favorites.filter((favorite: string) => favorite !== code);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function getFavorites(): string[] | null {
  let item: string | null = localStorage.getItem("favorites");
  if (item === null) {
    return null;
  }

  return JSON.parse(item);
}
