const PLACEHOLDER_IMAGE = "https://placehold.co/210x295/1a1a2e/white?text=Sin+imagen";

/**
 * Busca series por nombre
 * @param {string} query - Nombre de la serie a buscar
 * @returns {Array<{ id, name, image, rating, genres, status }>}
 */
export const searchShows = async (query) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
  const response = await fetch(URL);

  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

  const results = await response.json();

  return results.map(({ show }) => ({
    id: show.id,
    name: show.name,
    image: show.image?.medium ?? PLACEHOLDER_IMAGE,
    rating: show.rating?.average ?? null,
    genres: show.genres ?? [],
    status: show.status ?? "",
  }));
};

/**
 * Obtiene los datos principales de una serie por su ID
 * @param {string|number} id - ID de la serie en TVMaze
 * @returns {{ name, rating, image, summary, genres, status, network }}
 */
export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  return {
    name: data.name,
    rating: data.rating?.average ?? null,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE,
    imageLarge: data.image?.original ?? PLACEHOLDER_IMAGE,
    summary: data.summary ?? "",
    genres: data.genres ?? [],
    status: data.status ?? "",
    network: data.network?.name ?? data.webChannel?.name ?? "—",
  };
};

/**
 * Obtiene la lista de episodios agrupados por temporada
 * @param {string|number} id - ID de la serie en TVMaze
 * @returns {{ [season]: [{ number, season, name, rating }] }}
 */
export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const episodes = await response.json();

  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    name: episode.name,
    rating: episode.rating?.average,
  }));

  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
};
