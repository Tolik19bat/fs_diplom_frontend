// Импортируем модули, необходимые для работы класса
import AddMovieModal from "./AddMovieModal.js"; // Модальное окно добавления фильма
import PosterList from "./PosterList.js"; // Список постеров фильмов
import PosterModal from "./PosterModal.js"; // Модальное окно для отображения постера
import SeancesList from "./SeancesList.js"; // Список сеансов
import SeanceModal from "./SeanceModal.js"; // Модальное окно для настройки сеансов
import Fetch from "./Fetch.js"; // Модуль для выполнения HTTP-запросов

// Класс для управления сеткой сеансов
export default class SeanceGrid {
  /**
   * Конструктор класса
   * @param {Array} halls - Массив залов, передаваемый в качестве аргумента
   */
  constructor(halls = []) {
    this.halls = halls; // Сохраняем переданный массив залов
    this.init(); // Вызываем метод инициализации
  }

  /**
   * Метод инициализации логики класса
   * Получает список фильмов, инициализирует модальные окна и списки
   */
  init() {
    this.bindToDom(); // Привязываем методы к DOM-элементам

    // Загружаем список фильмов с сервера
    this.getMovies().then((movies) => {
      AddMovieModal.init(); // Инициализируем модальное окно добавления фильма
      this.posterList = new PosterList(movies); // Создаем список постеров фильмов
      PosterModal.init(); // Инициализируем модальное окно постера
      this.seancesList = new SeancesList(movies, this.halls); // Создаем список сеансов
      SeanceModal.init(); // Инициализируем модальное окно настройки сеанса
    });
  }

  /**
   * Метод привязки событий к элементам DOM
   */
  bindToDom() {
    // Получаем главный контейнер страницы
    this.mainEl = document.querySelector(".main");

    // Привязываем обработчик обновления зала к текущему экземпляру
    this.updateHandler = this.updateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.updateHandler); // Добавляем слушатель события обновления зала

    // Получаем кнопку "Добавить фильм"
    this.addMovieBtnEl = document.querySelector(".add-movie-btn");

    // Привязываем обработчик клика к кнопке
    this.onClickAddMovieBtn = this.onClickAddMovieBtn.bind(this);
    this.addMovieBtnEl.addEventListener("click", this.onClickAddMovieBtn); // Добавляем слушатель клика
  }

  /**
   * Обработчик клика по кнопке "Добавить фильм"
   */
  onClickAddMovieBtn() {
    AddMovieModal.showModal(); // Открываем модальное окно добавления фильма
  }

  /**
   * Обработчик события обновления зала
   * @param {Event} e - Объект события
   */
  updateHandler(e) {
    this.halls = e.detail.data; // Обновляем массив залов
    this.activeHallId = e.detail.id; // Сохраняем идентификатор активного зала
  }

  /**
   * Асинхронный метод получения списка фильмов с сервера
   * @returns {Promise<Array>} - Промис с массивом фильмов
   */
  async getMovies() {
    return await Fetch.send("GET", "movie"); // Отправляем GET-запрос для получения списка фильмов
  }
}