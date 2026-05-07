import { getShowData, getEpisodeList, searchShows } from "./services/tvmaze.js";

// ID inicial (Breaking Bad)
let CURRENT_ID = "169";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $loading = document.querySelector(".loading");
const $searchInput = document.querySelector(".search-input");
const $searchResults = document.querySelector(".search-results");

// ─── Helpers de rating ───────────────────────────────────────────────

const getRatingClass = (rating) => {
  if (!rating) return "rating-0";
  return `rating-${Math.floor(rating)}`;
};

const getRatingLabel = (rating) => {
  return rating ? `Rating: ${rating}` : "Sin valoración";
};

// ─── Componentes HTML ─────────────────────────────────────────────────

const createHeaderHTML = (show) => /* html */ `
  <div class="show-poster">
    <img src="${show.imageLarge}" alt="Póster de ${show.name}" />
  </div>
  <div class="show-info">
    <div class="show-genres">
      ${show.genres.map((g) => `<span class="genre-tag">${g}</span>`).join("")}
    </div>
    <h1 class="show-title">${show.name}</h1>
    <div class="show-meta">
      ${show.rating ? `<span class="show-rating">⭐ ${show.rating} / 10</span>` : ""}
      <span class="show-network">${show.network}</span>
      <span class="show-status ${show.status === "Ended" ? "ended" : "running"}">${show.status}</span>
    </div>
  </div>
`;

const createEpisodeHTML = (episode) => /* html */ `
  <div
    class="episode ${getRatingClass(episode.rating)}"
    title="E${String(episode.number).padStart(2, "0")} · ${episode.name} · ${getRatingLabel(episode.rating)}"
  >
    ${episode.number}
  </div>
`;

const createSeasonHTML = (data, number) => /* html */ `
  <article class="season">
    <header class="season-header">T${number}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;

// HTML de cada resultado en el dropdown de búsqueda
const createResultItemHTML = (show) => /* html */ `
  <button class="result-item" data-id="${show.id}">
    <img class="result-img" src="${show.image}" alt="${show.name}" />
    <div class="result-info">
      <span class="result-name">${show.name}</span>
      <span class="result-meta">
        ${show.rating ? `⭐ ${show.rating}` : "Sin rating"}
        ${show.genres.length ? `· ${show.genres.slice(0, 2).join(", ")}` : ""}
      </span>
    </div>
  </button>
`;

// ─── Render principal ─────────────────────────────────────────────────

const render = async (id) => {
  try {
    $loading.classList.remove("hidden");
    $header.innerHTML = "";
    $episodes.innerHTML = "";

    const [show, seasons] = await Promise.all([
      getShowData(id),
      getEpisodeList(id),
    ]);

    $header.setHTMLUnsafe(createHeaderHTML(show));

    const list = Object
      .values(seasons)
      .map((season, index) => createSeasonHTML(season, index + 1));

    $episodes.setHTMLUnsafe(list.join(""));

  } catch (error) {
    console.error("Error al cargar la serie:", error);
    $episodes.setHTMLUnsafe(`<p class="error">No se pudo cargar la serie.<br><small>${error.message}</small></p>`);
  } finally {
    $loading.classList.add("hidden");
  }
};

// ─── Búsqueda con debounce ────────────────────────────────────────────

let debounceTimer = null;

const handleSearch = async (query) => {
  if (query.trim().length < 2) {
    $searchResults.classList.add("hidden");
    $searchResults.innerHTML = "";
    return;
  }

  try {
    const results = await searchShows(query);

    if (results.length === 0) {
      $searchResults.setHTMLUnsafe(`<p class="no-results">No se encontraron series</p>`);
    } else {
      $searchResults.setHTMLUnsafe(results.map(createResultItemHTML).join(""));

      $searchResults.querySelectorAll(".result-item").forEach(($btn) => {
        $btn.addEventListener("click", () => {
          CURRENT_ID = $btn.dataset.id;
          $searchInput.value = "";
          $searchResults.classList.add("hidden");
          $searchResults.innerHTML = "";
          render(CURRENT_ID);
        });
      });
    }

    $searchResults.classList.remove("hidden");
  } catch (error) {
    console.error("Error en búsqueda:", error);
  }
};

$searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => handleSearch(e.target.value), 350);
});

// Cerrar resultados al hacer click fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    $searchResults.classList.add("hidden");
  }
});

// Carga inicial
render(CURRENT_ID);
