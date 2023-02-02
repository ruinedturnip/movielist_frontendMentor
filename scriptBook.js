const tvBox = document.getElementById("tvBox");
const movieBox = document.getElementById("movieBox");
const searchBox = document.getElementById("myInput");

let bookmarked = [];

for (let i = 0; i < localStorage.length; i++) {
  bookmarked.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
}

function populateBookmarks() {
  for (movie of bookmarked) {
    if (movie.isBookmarked === true) {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("recommended-movie");
      movieDiv.innerHTML = `
                <div class="recommended-movie-img"></div>
                <div class="overlay hide"><button class="overlay-btn"><img src="/assets/icon-play.svg" class="play-img" alt="Play Button"><p class="overlay-text">Play</p></button></div>

                <div class="recommended-bookmark">
                  <img
                    src=${
                      movie.isBookmarked === true
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
                        src=${
                          movie.category === "movie"
                            ? "/assets/icon-category-movie.svg"
                            : "/assets/icon-category-tv.svg"
                        }
                        alt="Movie category"
                        class="movie-category-icon"
                      />
                      ${movie.category}
                    </li>
                    <li class="recommended-movie-detail">${movie.rating}</li>
                  </ul>
                </div>`;

      movieDiv.style.backgroundImage = `url(${movie.thumbnail.regular.large})`;
      movie.category === "Movie"
        ? movieBox.appendChild(movieDiv)
        : tvBox.appendChild(movieDiv);
    }
  }
}

populateBookmarks();

document.querySelectorAll(".recommended-bookmark").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".recommended-movie").dataset.name = button
      .closest(".recommended-movie")
      .querySelector("h2").innerText;

    for (m of bookmarked) {
      if (
        m.title === button.closest(".recommended-movie").dataset.name &&
        m.isBookmarked === true
      ) {
        // button.closest(".recommended-movie").querySelector("img").src =
        //   "/assets/icon-bookmark-empty.svg";
        // m.isBookmarked = false;
        // console.log(bookmarked.indexOf(m));
        bookmarked.splice(bookmarked.indexOf(m), 1);
        localStorage.removeItem(m.title);

        button.closest(".recommended-movie").remove();
      }
    }
  });
});

document.querySelectorAll(".recommended-movie").forEach((movie) => {
  movie.addEventListener("mouseenter", () => {
    movie.querySelector(".overlay").classList.remove("hide");
  });
  movie.addEventListener("mouseleave", () => {
    movie.querySelector(".overlay").classList.add("hide");
  });
});

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
