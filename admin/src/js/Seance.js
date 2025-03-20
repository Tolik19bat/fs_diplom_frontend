import SeanceModal from "./SeanceModal.js";

// Класс для создания и управления отдельными сеансами
export default class Seance {

  // Конструктор принимает объект сеанса и список фильмов
  constructor(seance, movies) {
    this.seance = seance; // Сохраняем данные о текущем сеансе
    this.movies = movies; // Сохраняем список фильмов
    this.colors = [ // Набор цветов для визуального отображения сеансов
      "CAFF85", "85FF89", "85FFD3", "85E2FF", "8599FF",
      "BA85FF", "FF85FB", "FF85B1", "FFA885", "FFEB85"
    ];
    // console.log({"Seance": this});
  }

  // Метод для создания DOM-элемента, отображающего сеанс
  getSeancesElement() {
    // Создаем основной контейнер для сеанса
    const seancesMovieEl = document.createElement("div");
    seancesMovieEl.classList.add("conf-step__seances-movie"); // Добавляем класс для стилей

    // Привязываем обработчик клика на текущий контекст
    this.onClickSeance = this.onClickSeance.bind(this);
    seancesMovieEl.addEventListener("click", this.onClickSeance); // Добавляем слушатель события

    // Создаем элемент с названием фильма
    const seancesMovieTitleEl = document.createElement("p");
    seancesMovieTitleEl.classList.add("conf-step__seances-movie-title"); // Класс для стилей

    // Ищем название фильма по его идентификатору
    const title = this.movies.find((movie) => movie.id === this.seance.movie_id).title;
    seancesMovieTitleEl.textContent = title; // Устанавливаем название фильма

    // Создаем элемент для отображения времени начала сеанса
    const seancesMovieStartEl = document.createElement("p");
    seancesMovieStartEl.classList.add("conf-step__seances-movie-start"); // Класс для стилей
    seancesMovieStartEl.textContent = this.seance.start; // Устанавливаем время начала

    // Добавляем элементы названия и времени в контейнер сеанса
    seancesMovieEl.appendChild(seancesMovieTitleEl);
    seancesMovieEl.appendChild(seancesMovieStartEl);

    // Определяем индекс фильма для выбора цвета и ширины элемента
    const idx = this.movies.findIndex((movie) => movie.id === this.seance.movie_id);
    seancesMovieEl.style.backgroundColor = `#${this.colors[idx]}`; // Устанавливаем цвет фона
    seancesMovieEl.style.width = `${this.movies[idx].duration * 0.5}px`; // Устанавливаем ширину пропорционально длительности фильма

    // Рассчитываем позицию элемента на временной шкале
    const colonIdx = this.seance.start.indexOf(":");
    const startMinutes = parseInt(this.seance.start.slice(0, colonIdx)) * 60 +
                         parseInt(this.seance.start.slice(colonIdx + 1));
    seancesMovieEl.style.left = `${startMinutes * 0.5}px`; // Устанавливаем отступ слева

    return seancesMovieEl; // Возвращаем созданный элемент
  }

  // Обработчик клика по сеансу — вызывает модальное окно
  onClickSeance() {
    SeanceModal.showModal(this.seance.id); // Открываем модальное окно для данного сеанса
  }
}
