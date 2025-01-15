import PosterModal from "./PosterModal.js";

export default class Poster {
  constructor(arg) {
    this.movie = arg; // Сохраняем переданный объект фильма
  }

  // Метод для создания и возвращения HTML-элемента постера
  getElement() {
    const movieEl = document.createElement("div"); // Создаем контейнер для постера
    movieEl.classList.add("conf-step__movie"); // Добавляем классы для стилей
    movieEl.addEventListener("click", this.onClickPoster.bind(this)); // Добавляем обработчик клика

    // Создаем изображение, если доступен URL постера
    if (this.movie.poster_url) {
      const imgEl = document.createElement("img"); // Создаем элемент изображения
      imgEl.classList.add("conf-step__movie-poster"); // Добавляем классы
      imgEl.setAttribute("alt", "poster"); // Устанавливаем атрибут alt
      imgEl.setAttribute("src", this.movie.poster_url); // Устанавливаем источник изображения
      movieEl.appendChild(imgEl); // Добавляем изображение в контейнер постера
    }

    // Создаем элемент заголовка с названием фильма
    const titleEl = document.createElement("h3");
    titleEl.classList.add("conf-step__movie-title"); // Добавляем классы
    titleEl.textContent = this.movie.title; // Устанавливаем текст заголовка

    // Создаем элемент для продолжительности фильма
    const durationEl = document.createElement("p");
    durationEl.classList.add("conf-step__movie-duration"); // Добавляем классы
    durationEl.textContent = `${this.movie.duration} минут`; // Устанавливаем текст продолжительности

    // Добавляем заголовок и продолжительность в контейнер постера
    movieEl.appendChild(titleEl);
    movieEl.appendChild(durationEl);
    return movieEl; // Возвращаем полный элемент постера
  }

  // Обработчик клика по постеру
  onClickPoster() {
    PosterModal.showModal(this.movie); // Открываем модальное окно с деталями фильма
  }
}
