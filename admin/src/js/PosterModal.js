import AddMovieModal from "./AddMovieModal.js";
import { _URL } from "./app.js";
import SeancesTime from "./SeancesTime.js";

export default class PosterModal {
  // Объявление статических свойств класса для хранения данных и элементов управления фильмом
  static movie; // Переменная для хранения объекта текущего фильма (название, описание и т.д.)
  static containerEl; // Ссылка на элемент контейнера с информацией о фильме
  static closeBtnEl; // Ссылка на кнопку закрытия окна информации о фильме
  static infoTitleEl; // Ссылка на элемент, отображающий название фильма
  static infoDurationEl; // Ссылка на элемент, отображающий продолжительность фильма
  static infoCountryEl; // Ссылка на элемент, отображающий страну производства фильма
  static infoDescriptionEl; // Ссылка на элемент, отображающий описание фильма
  static infoStartDateEl; // Ссылка на элемент, отображающий дату начала показа
  static infoEndDateEl; // Ссылка на элемент, отображающий дату окончания показа
  static btnEditEl; // Ссылка на кнопку для редактирования данных фильма
  static hallSelectEl; // Ссылка на выпадающий список для выбора зала
  static timeInfoListEl; // Ссылка на элемент списка с информацией о времени сеансов
  static hoursSelectEl; // Ссылка на выпадающий список для выбора часов начала сеанса
  static minutesSelectEl; // Ссылка на выпадающий список для выбора минут начала сеанса
  static times; // Переменная для хранения массива или списка сеансов (временных слотов)
  static btnAddSeanceEl; // Ссылка на кнопку добавления нового сеанса
  static btnRemoveAllSeancesEl; // Ссылка на кнопку удаления всех сеансов
  static btnRemoveMovie; // Ссылка на кнопку удаления фильма из расписания

  // Инициализация класса
  static init() {
    PosterModal.bindToDom(); // Привязываем элементы DOM к свойствам класса
  }

  // Метод для привязки элементов DOM
  static bindToDom() {
    PosterModal.containerEl = document.querySelector(".modal-poster");
    PosterModal.closeBtnEl = document.querySelector(".modal-poster__btn-close");
    PosterModal.closeBtnEl.addEventListener(
      "click",
      PosterModal.onClickBtnClose
    );

    // Привязываем остальные элементы
    PosterModal.infoTitleEl = document.querySelector(
      ".modal-poster-info-title"
    );
    PosterModal.infoDurationEl = document.querySelector(
      ".modal-poster-info-duration"
    );
    PosterModal.infoCountryEl = document.querySelector(
      ".modal-poster-info-country"
    );
    PosterModal.infoDescriptionEl = document.querySelector(
      ".modal-poster-info-description"
    );
    PosterModal.infoStartDateEl = document.querySelector(
      ".modal-poster-info-start_date"
    );
    PosterModal.infoEndDateEl = document.querySelector(
      ".modal-poster-info-end_date"
    );

    PosterModal.btnEditEl = document.querySelector(".modal-poster__btn-edit");
    PosterModal.btnEditEl.addEventListener("click", PosterModal.onClickBtnEdit);

    PosterModal.hallSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-hall-select"
    );
    PosterModal.hallSelectEl.addEventListener(
      "change",
      PosterModal.onChangeHall
    );

    PosterModal.timeInfoListEl = PosterModal.containerEl.querySelector(
      ".modal-poster-time-info-list"
    );
    PosterModal.hoursSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-input-time-hours"
    );
    PosterModal.hoursSelectEl.addEventListener(
      "change",
      PosterModal.onChangeHour
    );

    PosterModal.minutesSelectEl = PosterModal.containerEl.querySelector(
      ".modal-poster-input-time-minutes"
    );
    PosterModal.btnAddSeanceEl = PosterModal.containerEl.querySelector(
      ".modal-poster__btn-add"
    );
    PosterModal.btnAddSeanceEl.addEventListener(
      "click",
      PosterModal.onClickBtnAddSeance
    );

    PosterModal.btnRemoveAllSeancesEl = PosterModal.containerEl.querySelector(
      ".modal-poster__btn-remove-all"
    );
    PosterModal.btnRemoveAllSeancesEl.addEventListener(
      "click",
      PosterModal.onClickBtnRemoveAllSeances
    );

    PosterModal.btnRemoveMovie = PosterModal.containerEl.querySelector(
      ".modal-poster__btn-remove-movie"
    );
    PosterModal.btnRemoveMovie.addEventListener(
      "click",
      PosterModal.onClickBtnRemoveMovie
    );
  }

  // Метод для отображения модального окна с информацией о фильме
  static showModal(movie) {
    PosterModal.movie = movie; // Сохраняем информацию о фильме
    PosterModal.renderMovieInformation(movie); // Отображаем информацию о фильме
    PosterModal.rendertHalls().then(() => {
      PosterModal.renderSeanceTime(movie); // Отображаем доступное время сеансов
      PosterModal.containerEl.classList.remove("hidden"); // Показываем модальное окно
    });
  }

  // Метод для отображения времени сеансов
  static renderSeanceTime(movie) {
    const seancesTime = new SeancesTime(PosterModal.hallSelectEl.value, movie);
    seancesTime.getAvailableTime().then((res) => {
      PosterModal.renderAvailableTime(res.strings); // Отображаем доступное время
      PosterModal.setOptions(res.availableTime); // Устанавливаем опции для выбора времени
      PosterModal.times = res.availableTime; // Сохраняем доступные времена
    });
  }

  // Метод для отображения информации о фильме
  static renderMovieInformation(movie) {
    PosterModal.infoTitleEl.textContent = movie.title;
    PosterModal.infoDurationEl.textContent = movie.duration;
    PosterModal.infoCountryEl.textContent = movie.country;
    PosterModal.infoDescriptionEl.textContent = movie.description;
    PosterModal.infoStartDateEl.textContent = movie.start_date;
    PosterModal.infoEndDateEl.textContent = movie.end_date;

    if (movie.poster_url) {
      const imgEl = document.createElement("img");
      imgEl.classList.add("modal-poster-info-img");
      imgEl.setAttribute("alt", "poster");
      imgEl.src = movie.poster_url;
      PosterModal.containerEl
        .querySelector(".modal-poster-info")
        .prepend(imgEl);
    }
  }

  // Метод для скрытия модального окна
  static hideModal() {
    const imgEl = PosterModal.containerEl.querySelector(
      ".modal-poster-info-img"
    );
    if (imgEl) {
      imgEl.remove(); // Удаляем изображение если оно есть
    }
    PosterModal.containerEl.classList.add("hidden"); // Скрываем модальное окно
    PosterModal.movie = undefined; // Сбрасываем информацию о фильме
  }

  // Обработчик клика для кнопки закрытия
  static onClickBtnClose() {
    PosterModal.hideModal();
  }

  // Обработчик клика для кнопки редактирования
  static onClickBtnEdit() {
    AddMovieModal.edit(PosterModal.movie); // Редактируем информацию о фильме
    PosterModal.hideModal();
  }

  // Метод для рендеринга залов
  static async rendertHalls() {
    PosterModal.hallSelectEl.innerHTML = ""; // Очищаем список залов
    await PosterModal.getHalls().then((res) => {
      res.forEach((hall) => {
        const hallTitleEl = document.createElement("option");
        hallTitleEl.value = hall.id; // Устанавливаем id зала
        hallTitleEl.textContent = hall.name; // Устанавливаем название зала
        PosterModal.hallSelectEl.appendChild(hallTitleEl); // Добавляем зал в выпадающий список
      });
    });
  }

  // Метод для получения списока залов с сервера
  static async getHalls() {
    const token = localStorage.getItem("token");
    try {
      const jsonResponse = await fetch(`${_URL}hall`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await jsonResponse.json();
      return response.length ? response : []; // Возвращаем ответ или пустой массив
    } catch (error) {
      console.error(error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  }

  // Метод для отображения доступного времени
  static renderAvailableTime(times) {
    PosterModal.timeInfoListEl.innerHTML = ""; // Очищаем список доступного времени
    times.forEach((time) => {
      const timeEl = document.createElement("p");
      timeEl.textContent = time; // Устанавливаем текст времени
      PosterModal.timeInfoListEl.appendChild(timeEl); // Добавляем элемент времени в список
    });
  }

  // Метод для установки опций выбора времени
  static setOptions(times) {
    PosterModal.setHoursOptions(times); // Устанавливаем часы
    const minutes = times[PosterModal.hoursSelectEl.value];
    PosterModal.setMinutesOptions(minutes); // Устанавливаем минуты
  }

  // Метод для установки часов
  static setHoursOptions(times) {
    PosterModal.hoursSelectEl.innerHTML = ""; // Очищаем выпадающий список часов
    times.forEach((hour, idxHour) => {
      if (hour.some((el) => el || el === 0)) {
        const hourOptionEl = document.createElement("option");
        hourOptionEl.value = idxHour; // Устанавливаем значение
        hourOptionEl.textContent = idxHour; // Устанавливаем текст
        PosterModal.hoursSelectEl.appendChild(hourOptionEl); // Добавляем часы в список
      }
    });
  }

  // Метод для установки минут
  static setMinutesOptions(minutes) {
    PosterModal.minutesSelectEl.innerHTML = ""; // Очищаем выпадающий список минут
    minutes.forEach((min) => {
      const minutesOptionEl = document.createElement("option");
      minutesOptionEl.value = min; // Устанавливаем значение минуты
      minutesOptionEl.textContent = min; // Устанавливаем текст
      PosterModal.minutesSelectEl.appendChild(minutesOptionEl); // Добавляем минуты в список
    });
  }

  // Обработчик изменения часа
  static onChangeHour(e) {
    e.preventDefault();
    const value = e.currentTarget.value;
    PosterModal.setMinutesOptions(PosterModal.times[value]); // Обновляем минуты в зависимости от выбранного часа
  }

  // Обработчик изменения зала
  static onChangeHall(e) {
    e.preventDefault();
    PosterModal.renderSeanceTime(PosterModal.movie); // Обновляем время сеансов при смене зала
  }

  // Обработчик клика для добавления сеанса
  static onClickBtnAddSeance(e) {
    e.preventDefault();
    PosterModal.addSeance().then(() => {
      PosterModal.hideModal(); // Скрываем модальное окно
      PosterModal.updateHallsSeances(); // Обновляем сеансы залов
    });
  }

  // Метод для добавления сеанса
  static async addSeance() {
    const token = localStorage.getItem("token");
    try {
      const jsonResponse = await fetch(`${_URL}seance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie_id: PosterModal.movie.id, // ID фильма
          hall_id: PosterModal.hallSelectEl.value, // ID зала
          start: `${PosterModal.hoursSelectEl.value}:${PosterModal.minutesSelectEl.value}`, // Время начала
        }),
      });
      const response = await jsonResponse.json();
      return response.id; // Возвращаем ID созданного сеанса
    } catch (error) {
      console.error(error);
      return null; // Возвращаем null в случае ошибки
    }
  }

  // Обработчик клика для удаления всех сеансов
  static onClickBtnRemoveAllSeances() {
    PosterModal.removeAllSeances().then(() => {
      PosterModal.hideModal(); // Скрываем модальное окно
      PosterModal.updateHallsSeances(); // Обновляем сеансы залов
    });
  }

  // Метод для обновления списка постеров
  static updatePosterList() {
    const event = new CustomEvent("updatePosterList");
    document.querySelector(".main").dispatchEvent(event); // Генерируем событие обновления
  }

  // Метод для обновления сеансов залов
  static updateHallsSeances() {
    const event = new CustomEvent("updateHallsSeances");
    document.querySelector(".main").dispatchEvent(event); // Генерируем событие обновления
  }

  // Метод для удаления всех сеансов фильма
  static async removeAllSeances() {
    const token = localStorage.getItem("token");
    try {
      const jsonResponse = await fetch(
        `${_URL}seance/all/${PosterModal.movie.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return jsonResponse.ok; // Возвращаем статус удаления
    } catch (error) {
      console.error(error);
    }
  }

  // Обработчик клика для удаления фильма
  static onClickBtnRemoveMovie() {
    PosterModal.removeMovie().then(() => {
      PosterModal.hideModal(); // Скрываем модальное окно
      PosterModal.updatePosterList(); // Обновляем список постеров
      PosterModal.updateHallsSeances(); // Обновляем сеансы залов
    });
  }

  // Метод для удаления фильма
  static async removeMovie() {
    const token = localStorage.getItem("token");
    try {
      const jsonResponse = await fetch(`${_URL}movie/${PosterModal.movie.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return jsonResponse.ok; // Возвращаем статус удаления
    } catch (error) {
      console.error(error);
    }
  }
}
