// import { _URL } from "./app.js";
import Seance from "./Seance.js";
import Fetch from "./Fetch.js";

export default class HallSeances {
  // Конструктор принимает информацию о зале и список фильмов
  constructor(hall, movies) {
    this.movies = movies; // Сохраняем список фильмов
    this.hall = hall; // Сохраняем информацию о зале
    this.seances = []; // Массив сеансов для данного зала
    this.seancesHallEl = null; // DOM-элемент для сеансов зала
  }

  // Асинхронный метод для получения элемента с сеансами зала
  async getSeancesHallElement() {
    // Ждем завершения получения сеансов, затем создаем элемент зала
    await this.getSeances().then(() => {
      this.createHallElement(); // Создаем элемент для отображения зала и сеансов
    });
    return this.seancesHallEl; // Возвращаем созданный элемент
  }

  // Асинхронный метод для получения списка сеансов из API
  async getSeances() {
    this.seances = await Fetch.send("GET", `hall/${this.hall.id}/seances`);
    return this.seances;
    // Отправляем асинхронный GET-запрос на сервер для получения списка сеансов (сеансы – это расписание показов в зале)
    // Используем метод `send` из объекта `Fetch`, передавая в него:
    // - метод запроса "GET"
    // - URL-адрес, сформированный с помощью интерполяции строк (подставляем ID зала)
    // Дожидаемся ответа от сервера с помощью `await` и сохраняем результат в `this.seances`

    // const token = localStorage.getItem("token"); // Получаем токен авторизации
    // try {
    //   // Делаем GET-запрос к API для получения сеансов данного зала
    //   const jsonResponse = await fetch(`${_URL}hall/${this.hall.id}/seances`, {
    //     method: "GET", // Используем метод GET
    //     headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовок
    //   });
    //   this.seances = await jsonResponse.json(); // Сохраняем полученные данные сеансов
    // } catch (error) {
    //   console.error(error); // Обрабатываем ошибки запроса
    // }
  }

  // Метод для создания DOM-элемента, отображающего сеансы зала
  async createHallElement() {
    // Создаем контейнер для сеансов зала
    this.seancesHallEl = document.createElement("div");
    this.seancesHallEl.classList.add("conf-step__seances-hall"); // Добавляем класс для стилей

    // Создаем заголовок с названием зала
    const seancesTitleEl = document.createElement("h3");
    seancesTitleEl.classList.add("conf-step__seances-title"); // Класс для заголовка
    seancesTitleEl.textContent = this.hall.name; // Устанавливаем имя зала

    // Создаем временную шкалу для отображения сеансов
    const seancesTimelineEl = document.createElement("div");
    seancesTimelineEl.classList.add("conf-step__seances-timeline"); // Класс для шкалы времени

    // Добавляем заголовок и временную шкалу в элемент сеансов зала
    this.seancesHallEl.appendChild(seancesTitleEl);
    this.seancesHallEl.appendChild(seancesTimelineEl);

    // Для каждого сеанса создаем элемент и добавляем его на шкалу
    this.seances.forEach((item) => {
      const seance = new Seance(item, this.movies); // Создаем экземпляр класса Seance
      const seanceEl = seance.getSeancesElement(); // Получаем элемент сеанса
      seancesTimelineEl.appendChild(seanceEl); // Добавляем элемент на шкалу времени
    });
  }
}
