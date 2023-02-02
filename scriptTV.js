const tvBox = document.getElementById("tvBox");
const searchBox = document.getElementById("myInput");
let bookmarked = [];

for (let i = 0; i < localStorage.length; i++) {
  bookmarked.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
}

console.log(bookmarked);

async function getMovies() {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();

    for (movie of data) {
      for (i of bookmarked) {
        if (i.title === movie.title && i.isBookmarked === true) {
          movie.isBookmarked = true;
        }
      }

      console.log(movie, movie.title, movie.category, movie.isBookmarked);

      if (movie.category === "TV Series") {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("recommended-movie");
        movieDiv.innerHTML = `
        <div class="recommended-movie-img"></div>
        <div class="overlay hide"><button class="overlay-btn"><img src="/assets/icon-play.svg" class="play-img" alt="Play Button"><p class="overlay-text">Play</p></button></div>

        <div class="recommended-bookmark">
          <img
            src=
            ${
              movie.isBookmarked
                ? "/assets/icon-bookmark-full.svg"
                : "/assets/icon-bookmark-empty.svg"
            }
            alt="Bookmark"
            class="recommended-bookmark-img"
          />
        </div>
        <div class="recommended-text-box">
          <h2 class="recommended-movie-title">${movie.title}</h2>
          <ul class="recommended-movie-list">
            <li class="recommended-movie-detail">${movie.year}</li>
            <li class="recommended-movie-detail">
              <img
                src="/assets/icon-category-movie.svg"
                alt="Movie category"
                class="movie-category-icon"
              />
              Movie
            </li>
            <li class="recommended-movie-detail">${movie.rating}</li>
          </ul>
        </div>`;

        movieDiv.style.backgroundImage = `url(${movie.thumbnail.regular.large})`;
        tvBox.appendChild(movieDiv);
      }

      document.querySelectorAll(".recommended-bookmark").forEach((button) => {
        button.addEventListener("click", function () {
          // Change IMAGE
          button
            .closest(".recommended-movie")
            .querySelector(".recommended-bookmark-img").src =
            "/assets/icon-bookmark-full.svg";

          // ADD Movie to BOOKMARKS
          button.closest(".recommended-movie").dataset.name = button
            .closest(".recommended-movie")
            .querySelector("h2").innerText;

          for (m of data) {
            if (
              m.title === button.closest(".recommended-movie").dataset.name &&
              m.isBookmarked === false
            ) {
              m.isBookmarked = true;
              bookmarked.push(m);
              localStorage.setItem(m.title, JSON.stringify(m));
              console.log(bookmarked);
            } else if (
              m.title === button.closest(".recommended-movie").dataset.name &&
              m.isBookmarked === true
            ) {
              button
                .closest(".recommended-movie")
                .querySelector(".recommended-bookmark-img").src =
                "/assets/icon-bookmark-empty.svg";
              m.isBookmarked = false;
              bookmarked.splice(bookmarked.indexOf(m), 1);
              localStorage.removeItem(m.title);
              console.log(bookmarked);
            }
          }
        });
      });
    }

    document.querySelectorAll(".recommended-movie").forEach((movie) => {
      movie.addEventListener("mouseenter", () => {
        movie.querySelector(".overlay").classList.remove("hide");
      });
      movie.addEventListener("mouseleave", () => {
        movie.querySelector(".overlay").classList.add("hide");
      });
    });
  } catch (err) {
    console.error(err);
  }
}

getMovies();

// SEARCH FUNCTION
searchBox.addEventListener("input", updateValue);

function updateValue(e) {
  const filter = searchBox.value.toUpperCase();
  const movies = document.querySelectorAll(".recommended-movie");

  movies.forEach((movie) => {
    if (
      movie
        .querySelector("h2")
        .textContent.toUpperCase()
        .includes(filter.toUpperCase())
    ) {
      movie.style.display = "";
    } else {
      movie.style.display = "none";
    }
  });
}
