import { _URL } from "./app.js";

export default class SeancesTime {
  constructor(hallId, movie) {
    this.hallId = hallId; // ID зала.
    this.movieId = movie.id; // ID фильма.
    this.movieDuration = +movie.duration; // Продолжительность фильма (преобразуем в число).
    this.seances = []; // Массив сеансов.
    this.availableTime = []; // Массив доступного времени.
    this.init(); // Инициализация доступного времени.
  }

  // Метод для инициализации доступного времени.
  init() {
    this.availableTime = SeancesTime.initSampleAvailableTime(); // Заполняем массив времени стандартными интервалами.
  }

  // Метод для получения доступного времени.
  async getAvailableTime() {
    await this.getSeances().then(() => {
      // Сначала получаем все сеансы.
      this.calculateAvailableTime(); // Затем вычисляем доступное время.
    });
    return {
      availableTime: this.availableTime, // Возвращаем доступное время.
      strings: this.getAvailableTimeStrings(), // И строки для отображения.
    };
  }

  // Статический метод для инициализации массива доступного времени.
  static initSampleAvailableTime() {
    const time = [];
    for (let i = 0; i < 24; i += 1) {
      // Цикл по часам от 0 до 23.
      const minutes = [];
      for (let j = 0; j < 60; j += 10) {
        // Интервалы времени каждые 10 минут.
        minutes.push(j);
      }
      time.push(minutes); // Добавляем массив минут для каждого часа.
    }
    return time;
  }

  // Асинхронный метод для получения всех сеансов зала.
  async getSeances() {
    const token = localStorage.getItem("token"); // Получаем токен для авторизации.
    try {
      const jsonResponse = await fetch(`${_URL}hall/${this.hallId}/seances`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Заголовок с токеном.
      });
      const response = await jsonResponse.json(); // Парсим JSON-ответ.
      this.seances = response; // Сохраняем полученные сеансы.
    } catch (error) {
      console.error(error); // Обработка ошибок.
    }
  }

  // Метод для вычисления доступного времени с учетом занятых сеансов.
  calculateAvailableTime() {
    const timeBoundaries = this.getTimeBoundaries(); // Получаем границы времени занятых сеансов.
    this.availableTime.forEach((hour, idxHour) => {
      hour.forEach((minutes, idxMinutes) => {
        timeBoundaries.forEach((timeBoundarie) => {
          // Проверяем и удаляем время, занятое сеансами.
          if (
            idxHour >= timeBoundarie.startingHour &&
            idxHour <= timeBoundarie.endingHour
          ) {
            if (
              idxHour === timeBoundarie.startingHour &&
              idxHour != timeBoundarie.endingHour
            ) {
              if (minutes >= timeBoundarie.startingMinutes) {
                delete hour[idxMinutes];
              }
            }
            if (
              idxHour > timeBoundarie.startingHour &&
              idxHour < timeBoundarie.endingHour
            ) {
              delete hour[idxMinutes];
            }
            if (
              idxHour != timeBoundarie.startingHour &&
              idxHour === timeBoundarie.endingHour
            ) {
              if (minutes <= timeBoundarie.endingMinutes) {
                delete hour[idxMinutes];
              }
            }
            if (
              idxHour === timeBoundarie.startingHour &&
              idxHour === timeBoundarie.endingHour
            ) {
              if (
                minutes >= timeBoundarie.startingMinutes &&
                minutes <= timeBoundarie.endingMinutes
              ) {
                delete hour[idxMinutes];
              }
            }
          }
          // Обрабатываем случай, когда время сеанса переходит через полночь.
          if (timeBoundarie.startingHour > timeBoundarie.endingHour) {
            if (idxHour >= timeBoundarie.startingHour && idxHour <= 23) {
              if (idxHour === timeBoundarie.startingHour) {
                if (minutes >= timeBoundarie.startingMinutes) {
                  delete hour[idxMinutes];
                }
              }
              if (idxHour > timeBoundarie.startingHour) {
                delete hour[idxMinutes];
              }
            }
            if (idxHour >= 0 && idxHour <= timeBoundarie.endingHour) {
              if (idxHour === timeBoundarie.endingHour) {
                if (minutes <= timeBoundarie.endingMinutes) {
                  delete hour[idxMinutes];
                }
              }
              if (idxHour < timeBoundarie.endingHour) {
                delete hour[idxMinutes];
              }
            }
          }
        });
      });
    });

    // Учитываем длительность фильма при вычислении доступного времени.
    let counter = 0;
    let isStart = false;
    for (let i = this.availableTime.length - 1; i >= 0; i -= 1) {
      for (let j = this.availableTime[i].length - 1; j >= 0; j -= 1) {
        if (this.availableTime[i][j] || this.availableTime[i][j] === 0) {
          if (isStart === true) {
            if (counter < this.movieDuration) {
              delete this.availableTime[i][j];
            }
            counter += 10;
          }
        } else {
          counter = 0;
          isStart = true;
        }
      }
    }
  }

  // Метод для получения временных границ для каждого сеанса.
  getTimeBoundaries() {
    const timeBoundaries = [];
    const hoursDuration = Math.trunc(this.movieDuration / 60); // Часы длительности фильма.
    const minutesDuration = this.movieDuration % 60; // Минуты длительности фильма.
    this.seances.forEach((seance) => {
      const colonIdx = seance.start.indexOf(":"); // Ищем двоеточие в строке времени.
      const startingHour = +seance.start.slice(0, colonIdx); // Часы начала сеанса.
      const startingMinutes = +seance.start.slice(colonIdx + 1); // Минуты начала.
      let correction = 0;
      let endingMinutes = startingMinutes + minutesDuration;
      if (endingMinutes >= 60) {
        endingMinutes -= 60;
        correction = 1;
      }
      let endingHour = startingHour + hoursDuration + correction;
      if (endingHour >= 24) {
        endingHour -= 24;
      }
      timeBoundaries.push({
        startingHour,
        startingMinutes,
        endingHour,
        endingMinutes,
      });
    });
    return timeBoundaries;
  }

  // Метод для преобразования доступного времени в строки для отображения.
  getAvailableTimeStrings() {
    let startValue;
    let endValue;
    let isStart = false;
    const availableTime = [];
    for (let i = 0; i < this.availableTime.length; i += 1) {
      for (let j = 0; j < this.availableTime[i].length; j += 1) {
        if (this.availableTime[i][j] || this.availableTime[i][j] === 0) {
          if (this.availableTime[i][j] === 0) {
            this.availableTime[i][j] = "00";
          }
          if (!isStart) {
            isStart = true;
            startValue =
              i < 10
                ? `0${i}:${this.availableTime[i][j]}`
                : `${i}:${this.availableTime[i][j]}`;
          }
          endValue =
            i < 10
              ? `0${i}:${this.availableTime[i][j]}`
              : `${i}:${this.availableTime[i][j]}`;
        } else {
          if (isStart) {
            availableTime.push(`с ${startValue} по ${endValue}`);
          }
          isStart = false;
        }
      }
    }
    if (isStart) {
      availableTime.push(`с ${startValue} по ${endValue}`);
    }
    return availableTime;
  }
}
