import { _URL_HALL } from "./app.js";

// Определяем класс MovieSeancesHall для работы с сеансами фильмов в конкретном зале
export default class MovieSeancesHall {
  // Конструктор принимает название зала и список сеансов
  constructor(hallName, seances) {
    this.hallName = hallName; // Название зала
    this.seances = seances; // Массив объектов сеансов
    this.movieSeancesHallEl = null; // Элемент DOM для отображения зала и его сеансов
  }

  // Метод для создания DOM-элемента зала с сеансами
  createMovieSeancesHallEl() {
    // Создаем div для зала
    this.movieSeancesHallEl = document.createElement("div");
    this.movieSeancesHallEl.classList.add("movie-seances__hall");

    // Создаем заголовок с названием зала
    const movieSeancesHallTitleEl = document.createElement("h3");
    movieSeancesHallTitleEl.classList.add("movie-seances__hall-title");
    movieSeancesHallTitleEl.textContent = this.hallName;

    // Создаем список сеансов
    const movieSeancesListEl = document.createElement("ul");
    movieSeancesListEl.classList.add("movie-seances__list");

    // Сортируем массив сеансов по времени в формате HH:MM
    this.seances.sort((a, b) => {
      // Разбиваем строки времени на часы и минуты
      const [aHours, aMinutes] = a.start.split(":").map(Number);
      const [bHours, bMinutes] = b.start.split(":").map(Number);

      // Переводим в минуты с полуночи для сравнения
      const aTotalMinutes = aHours * 60 + aMinutes;
      const bTotalMinutes = bHours * 60 + bMinutes;

      return aTotalMinutes - bTotalMinutes; // Сортировка по возрастанию
    });

    // Проходим по каждому сеансу для добавления его в список
    this.seances.forEach((seance) => {
      // Создаем элемент для блока времени сеанса
      const movieSeancesTimeBlockEl = document.createElement("li");
      movieSeancesTimeBlockEl.classList.add("movie-seances__time-block");

      // Создаем ссылку на конкретный сеанс
      const movieSeancesTimeEl = document.createElement("a");
      movieSeancesTimeEl.classList.add("movie-seances__time");
      movieSeancesTimeEl.setAttribute("href", _URL_HALL); // Устанавливаем URL для перехода
      movieSeancesTimeEl.dataset.seanceId = seance.id; // Добавляем ID сеанса в атрибут data
      movieSeancesTimeEl.textContent = seance.start; // Устанавливаем время начала сеанса

      // Привязываем обработчик событий к ссылке
      this.onClickMovieSeansesTime = this.onClickMovieSeansesTime.bind(this);
      movieSeancesTimeEl.addEventListener(
        "click",
        this.onClickMovieSeansesTime
      );

      // Добавляем ссылку в блок времени, а блок в список
      movieSeancesTimeBlockEl.appendChild(movieSeancesTimeEl);
      movieSeancesListEl.appendChild(movieSeancesTimeBlockEl);
    });

    // Добавляем заголовок и список сеансов в элемент зала
    this.movieSeancesHallEl.appendChild(movieSeancesHallTitleEl);
    this.movieSeancesHallEl.appendChild(movieSeancesListEl);
  }

  // Метод для получения элемента зала с сеансами
  getHallSeancesEl() {
    this.createMovieSeancesHallEl(); // Создаем элемент при первом вызове
    return this.movieSeancesHallEl; // Возвращаем созданный элемент
  }

  // Обработчик клика по времени сеанса
  onClickMovieSeansesTime(e) {
    e.preventDefault(); // Предотвращаем переход по ссылке

    const clickedTime = e.currentTarget.textContent.trim(); // Получаем время сеанса ("HH:MM")

    // Получаем текущее время
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;

    console.log(`Время сеанса: ${clickedTime}, Текущее время: ${currentTime}`);

    // Преобразуем время в минуты для корректного сравнения
    const [clickedHours, clickedMinutes] = clickedTime.split(":").map(Number);
    const [currentHoursNum, currentMinutesNum] = currentTime
      .split(":")
      .map(Number);

    const clickedTotalMinutes = clickedHours * 60 + clickedMinutes;
    const currentTotalMinutes = currentHoursNum * 60 + currentMinutesNum;

    console.log(
      `Сеанс (минуты): ${clickedTotalMinutes}, Сейчас (минуты): ${currentTotalMinutes}`
    );

    // Сравниваем время в минутах
    if (clickedTotalMinutes <= currentTotalMinutes) {
      alert("На это время билет уже нельзя купить");
      return;
    }

    // Создаем и диспатчим кастомное событие для перехода к экрану зала
    const event = new CustomEvent("goToHallHtml", {
      detail: {
        seanceId: e.currentTarget.dataset.seanceId, // Передаем ID сеанса
      },
    });
    document.querySelector("main").dispatchEvent(event); // Отправляем событие на главный элемент
  }
}
