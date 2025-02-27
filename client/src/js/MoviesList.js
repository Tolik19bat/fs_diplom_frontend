import { _URL_HALL } from "./app.js";
import Movie from "./Movie.js";
import Fetch from "./Fetch.js";

// Экспортируем класс для управления списком фильмов
export default class MoviesList {
  constructor() {
    // Инициализируем свойства класса
    this.movies = []; // Массив для хранения фильмов
    this.halls = []; // Массив для хранения залов
    this.date = null; // Дата для отображения фильмов
    this.init(); // Запускаем инициализацию
  }

  // Метод для начальной настройки
  init() {
    this.bindToDom(); // Привязываем обработчики событий к DOM
  }

  // Метод привязки элементов и событий к DOM
  bindToDom() {
    this.containerEl = document.querySelector("main"); // Получаем элемент контейнера
    // Привязываем метод перехода на страницу зала к пользовательскому событию
    this.containerEl.addEventListener(
      "goToHallHtml",
      this.goToPageHall.bind(this)
    );
    this.getMoviesList = this.getMoviesList.bind(this); // Связываем метод для дальнейшего использования
  }

  // Асинхронный метод для получения списка фильмов на определенную дату
  async getMoviesList(date) {
    this.date = date; // Сохраняем выбранную дату
    this.getMovies(date).then(() => {
      // Получаем список фильмов
      this.getHalls().then(() => {
        // Затем получаем доступные залы
        this.renderList(); // И рендерим список фильмов
      });
    });
  }

  // Асинхронный метод для получения фильмов с сервера
  async getMovies(date) {
    const formateDate = date.toISOString().slice(0, 10); // Преобразуем дату в строку формата "YYYY-MM-DD"
    this.movies = await Fetch.send("GET", `movie/date/${formateDate}`); // Отправляем GET-запрос для получения списка фильмов на указанную дату

    // try {
    //   const formateDate = date.toISOString().slice(0, 10); // Форматируем дату в строку
    //   const jsonResponse = await fetch(`${_URL}movie/date/${formateDate}`); // Отправляем запрос на сервер
    //   this.movies = await jsonResponse.json(); // Сохраняем полученные данные
    // } catch (error) {
    //   console.error(error); // Логируем ошибку, если она возникла
    // }
  }

  // Асинхронный метод для получения залов с доступными сеансами
  async getHalls() {
    this.halls = await Fetch.send("GET", "hall/seances/available"); // Отправляем GET-запрос для получения списка залов с доступными сеансами

    // фильтрация залов, где включены продажи билетов
    // this.halls = response.filter(hall => hall.sales);

    // try {
    //   const jsonResponse = await fetch(`${_URL}hall/seances/available`); // Запрос на доступные залы
    //   const response = await jsonResponse.json(); // Обрабатываем ответ
    //   this.halls = response.filter((hall) => hall.sales); // Фильтруем залы, где есть продажи
    // } catch (error) {
    //   console.error(error); // Логируем ошибку
    // }
  }

  // Метод для рендеринга списка фильмов
  renderList() {
    this.containerEl.innerHTML = ""; // Очищаем контейнер
    this.movies.forEach((item) => {
      const movie = new Movie(item, this.halls); // Создаем объект фильма
      movie.getMovieEl().then((element) => {
        // Получаем элемент фильма
        this.containerEl.appendChild(element); // Добавляем элемент в контейнер
      });
    });
  }

  // Метод для перехода на страницу с залом
  goToPageHall(e) {
    this.sendDataToSessionStorage(e.detail.seanceId, this.date); // Сохраняем данные в sessionStorage
    window.location.href = _URL_HALL; // Переходим по указанному URL
  }

  // Метод для сохранения данных в sessionStorage
  sendDataToSessionStorage(seanceId, date) {
    sessionStorage.setItem("seanceId", seanceId); // Сохраняем ID сеанса
    sessionStorage.setItem("date", date); // Сохраняем дату
  }
}
