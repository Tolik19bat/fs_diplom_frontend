import { _URL } from "./app.js";
import MovieSeancesHall from "./MovieSeancesHall.js";
import Fetch from "./Fetch.js";

// Экспортируем класс для работы с отдельным фильмом
export default class Movie {
  // Конструктор принимает объект фильма и список залов
  constructor(movie, halls) {
    this.movie = movie; // Сохраняем данные фильма
    this.halls = halls; // Сохраняем список залов
  }

  // Асинхронный метод для создания элемента фильма
  async createMovieEl() {
    // Создаем элемент секции для фильма
    this.movieEl = document.createElement("section");
    this.movieEl.classList.add("movie"); // Добавляем CSS-класс для оформления

    // Создаем и добавляем элемент с информацией о фильме
    const movieInfoEl = this.createMovieInfoEl();
    this.movieEl.appendChild(movieInfoEl);

    // Проходим по каждому залу и добавляем сеансы
    this.halls.forEach((hall) => {
      this.getSeances(hall.id).then((seances) => {
        if (seances.length > 0) {
          // Создаем элемент с сеансами для конкретного зала
          const movieSeancesHall = new MovieSeancesHall(hall.name, seances);
          const movieSeancesHallEl = movieSeancesHall.getHallSeancesEl();
          this.movieEl.appendChild(movieSeancesHallEl); // Добавляем сеансы в элемент фильма
        }
      });
    });
  }

  // Метод для создания элемента с информацией о фильме
  createMovieInfoEl() {
    const movieInfoEl = document.createElement("div");
    movieInfoEl.classList.add("movie__info");

    // Блок постера
    const moviePosterEl = document.createElement("div");
    moviePosterEl.classList.add("movie__poster");
    const moviePosterImageEl = document.createElement("img");
    moviePosterImageEl.classList.add("movie__poster-image");
    moviePosterImageEl.setAttribute("alt", "постер");
    moviePosterImageEl.setAttribute("src", this.movie.poster_url);
    moviePosterEl.appendChild(moviePosterImageEl);

    // Блок описания
    const movieDescriptionEl = document.createElement("div");
    movieDescriptionEl.classList.add("movie__description");

    const movieTitleEl = document.createElement("h2");
    movieTitleEl.classList.add("movie__title");
    movieTitleEl.textContent = this.movie.title;

    const movieSynopsisEl = document.createElement("p");
    movieSynopsisEl.classList.add("movie__synopsis");
    movieSynopsisEl.textContent = this.movie.description;

    const movieDataEl = document.createElement("p");
    movieDataEl.classList.add("movie__data");

    const movieDataDurationEl = document.createElement("span");
    movieDataDurationEl.classList.add("movie__data-duration");
    movieDataDurationEl.textContent = `${this.movie.duration} минут`;

    const movieDataOriginEl = document.createElement("span");
    movieDataOriginEl.classList.add("movie__data-origin");
    movieDataOriginEl.textContent = this.movie.country;

    // Собираем данные о фильме
    movieDataEl.appendChild(movieDataDurationEl);
    movieDataEl.appendChild(movieDataOriginEl);
    movieDescriptionEl.appendChild(movieTitleEl);
    movieDescriptionEl.appendChild(movieSynopsisEl);
    movieDescriptionEl.appendChild(movieDataEl);
    movieInfoEl.appendChild(moviePosterEl);
    movieInfoEl.appendChild(movieDescriptionEl);

    return movieInfoEl;
  }

  // Метод для получения элемента фильма
  async getMovieEl() {
    await this.createMovieEl(); // Создаем элемент фильма
    return this.movieEl; // Возвращаем его
  }

  // Асинхронный метод для получения сеансов фильма в конкретном зале
  async getSeances(hallId) {
    return await Fetch.send("GET", `hall/${hallId}/seances/${this.movie.id}`); // Отправляем асинхронный GET-запрос для получения сеансов конкретного фильма в выбранном зале

    // try {
    //   const jsonResponse = await fetch(
    //     `${_URL}hall/${hallId}/seances/${this.movie.id}`
    //   ); // Запрос к API для получения сеансов
    //   return jsonResponse.json(); // Возвращаем полученные данные
    // } catch (error) {
    //   console.error(error); // Логируем ошибку
    // }
  }
}
