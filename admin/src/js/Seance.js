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
    console.log({"Seance": this});
  }

  // Метод для создания DOM-элемента, отображающего сеанс
  getSeancesElement() {
    const seancesMovieEl = document.createElement("div");
    seancesMovieEl.classList.add("conf-step__seances-movie");
  
    this.onClickSeance = this.onClickSeance.bind(this);
    seancesMovieEl.addEventListener("click", this.onClickSeance);
  
    const seancesMovieTitleEl = document.createElement("p");
    seancesMovieTitleEl.classList.add("conf-step__seances-movie-title");
  
    // Проверяем, что фильм существует
    const movie = this.movies.find((movie) => movie.id === this.seance.movie_id);
    if (!movie) {
      console.error("Фильм не найден:", this.seance.movie_id);
      return seancesMovieEl; // Возвращаем пустой элемент, если фильм не найден
    }
  
    seancesMovieTitleEl.textContent = movie.title;
  
    const seancesMovieStartEl = document.createElement("p");
    seancesMovieStartEl.classList.add("conf-step__seances-movie-start");
    seancesMovieStartEl.textContent = this.seance.start;
  
    seancesMovieEl.appendChild(seancesMovieTitleEl);
    seancesMovieEl.appendChild(seancesMovieStartEl);
  
    const idx = this.movies.findIndex((movie) => movie.id === this.seance.movie_id);
    seancesMovieEl.style.backgroundColor = `#${this.colors[idx]}`;
    seancesMovieEl.style.width = `${this.movies[idx].duration * 0.5}px`;
  
    const colonIdx = this.seance.start.indexOf(":");
    const startMinutes = parseInt(this.seance.start.slice(0, colonIdx)) * 60 +
                         parseInt(this.seance.start.slice(colonIdx + 1));
    seancesMovieEl.style.left = `${startMinutes * 0.5}px`;
  
    return seancesMovieEl;
  }

  // Обработчик клика по сеансу — вызывает модальное окно
  onClickSeance() {
    SeanceModal.showModal(this.seance.id); // Открываем модальное окно для данного сеанса
  }
}
