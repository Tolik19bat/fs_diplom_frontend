import { _URL } from "./app.js";
import AddMovieModal from "./AddMovieModal.js";
import PosterList from "./PosterList.js";
import PosterModal from "./PosterModal.js";
import SeancesList from "./SeanceList.js";
import SeanceModal from "./SeanceModal.js";

export default class SeanceGrid {
  constructor() {
    this.init(); // Инициализируем экземпляр класса
  }

  // Метод для инициализации логики класса
  init() {
    this.bindToDom(); // Связываем DOM-элементы с методами
    // Получаем список фильмов и инициализируем модальные окна и списки
    this.getMovies().then((movies) => {
      AddMovieModal.init(); // Инициализация окна добавления фильма
      this.posterList = new PosterList(movies); // Создаем список постеров фильмов
      PosterModal.init(); // Инициализация модального окна постера
      this.seancesList = new SeancesList(movies); // Создаем список сеансов
      SeanceModal.init(); // Инициализация модального окна сеанса
    });
  }

  // Метод для связывания DOM-элементов
  bindToDom() {
    this.mainEl = document.querySelector(".main"); // Находим основной элемент
    this.updateHandler = this.updateHandler.bind(this); // Привязываем обработчик обновления
    this.mainEl.addEventListener("updateHall", this.updateHandler); // Добавляем слушатель события обновления зала
    this.addMovieBtnEl = document.querySelector(".add-movie-btn"); // Находим кнопку добавления фильма
    this.onClickAddMovieBtn = this.onClickAddMovieBtn.bind(this); // Привязываем обработчик клика по кнопке
    this.addMovieBtnEl.addEventListener("click", this.onClickAddMovieBtn); // Добавляем слушатель клика по кнопке
  }

  // Обработчик события клика по кнопке добавления фильма
  onClickAddMovieBtn() {
    AddMovieModal.showModal(); // Показываем модальное окно добавления фильма
  }

  // Обработчик обновления зала
  updateHandler(e) {
    this.halls = e.detail.data; // Получаем данные залов из события
    this.activeHallId = e.detail.id; // Получаем идентификатор активного зала
  }

  // Асинхронный метод для получения списка фильмов
  async getMovies() {
    const token = localStorage.getItem("token"); // Получаем токен из локального хранилища
    try {
      const jsonResponse = await fetch(`${_URL}movie`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовки запроса
      });
      const response = await jsonResponse.json(); // Преобразуем ответ в JSON
      return response; // Возвращаем список фильмов
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль при возникновении
    }
  }
}
