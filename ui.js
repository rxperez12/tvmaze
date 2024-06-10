import { getEpisodesOfShow, searchShowsByTerm } from "./models"

const $showsList = document.querySelector("#showsList");
const $episodesList = document.querySelector("#episodesList");
const $episodesArea = document.querySelector("#episodesArea");
const $searchForm = document.querySelector("#searchForm");
const $term = document.querySelector("#searchForm-term");

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.innerHTML = "";

  for (const show of shows) {
    const $show = document.createElement("div");
    $show.innerHTML = `
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `;

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const searchTerm = $term.value;
  const shows = await searchShowsByTerm(searchTerm);

  $episodesArea.classList.add("d-none");
  populateShows(shows);
}

$searchForm.addEventListener("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given list of episodes, create markup for each and to DOM */

function populateEpisodes(episodes) {
  $episodesList.innerHTML = "";

  for (const episode of episodes) {
    const $item = document.createElement("li");
    $item.innerHTML = `    
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
    `;

    $episodesList.append($item);
  }

  $episodesArea.classList.remove("d-none");
}

/** Handle click on episodes button: get episodes for show and display */

async function getEpisodesAndDisplay(evt) {
  const $clicked = evt.target;
  if (!$clicked.matches(".Show-getEpisodes")) return;

  // here's one way to get the ID of the show: search "closest" ancestor
  // with the class of .Show (which is put onto the enclosing div, which
  // has the .data-show-id attribute).
  const $closest = (evt.target).closest(".Show");
  const showId = Number($closest.getAttribute("data-show-id"));
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.addEventListener("click", getEpisodesAndDisplay);
