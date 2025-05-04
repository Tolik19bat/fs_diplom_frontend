// Импортируем модуль Fetch для выполнения HTTP-запросов
import Fetch from "./Fetch.js";

// Экспортируем класс SeancesTime как модуль по умолчанию
export default class SeancesTime {
  // Конструктор принимает ID зала и объект фильма
  constructor(hallId, movie) {
    this.hallId = hallId; // Сохраняем ID зала
    this.movieId = movie.id; // Сохраняем ID фильма
    this.movieDuration = +movie.duration; // Преобразуем длительность фильма в число и сохраняем
    this.movieCache = [];
    this.seances = []; // Инициализируем массив для хранения уже существующих сеансов
    this.availableTime = []; // Инициализируем массив для хранения доступного времени
    this.init(); // Вызываем метод инициализации доступного времени
  }

  // Метод инициализирует массив доступного времени
  init() {
    this.availableTime = SeancesTime.initSampleAvailableTime(); // Получаем стандартные интервалы времени и сохраняем
    // console.log(this.availableTime);
  }

  // Метод возвращает доступное время и его строковое представление
  async getAvailableTime() {
    await this.getSeances(); // Получаем все существующие сеансы из API
    this.calculateAvailableTime(); // Рассчитываем доступное время, исключая занятое
    return {
      availableTime: this.availableTime, // Возвращаем доступные интервалы в виде массива
      strings: this.getAvailableTimeStrings(), // Также возвращаем строки для отображения
    };
  }

  // Статический метод создаёт шаблон доступного времени: каждый час содержит минуты с шагом 10
  static initSampleAvailableTime() {
    const time = []; // Массив для хранения всех часов и минут
    for (let i = 0; i < 24; i += 1) {
      // Проходим по каждому часу от 0 до 23
      const minutes = []; // Массив минут в текущем часе
      for (let j = 0; j < 60; j += 10) {
        // Добавляем минуты с шагом 10
        minutes.push(j);
      }
      time.push(minutes); // Добавляем массив минут к текущему часу
    }
    return time; // Возвращаем полный массив
  }

  // Метод получает список всех сеансов указанного зала
  async getSeances() {
    this.seances = await Fetch.send("GET", `hall/${this.hallId}/seances`);
    // Выполняем GET-запрос к API, чтобы получить список сеансов
    // Дозапрашиваем длительности для каждого фильма
    for (const seance of this.seances) {
      if (!this.movieCache[seance.movie_id]) {
        this.movieCache[seance.movie_id] = await Fetch.send(
          "GET",
          `movie/${seance.movie_id}`
        );
        // console.log(this.movieCache);
      }
      seance.duration = this.movieCache[seance.movie_id].duration;
      // console.log("Длительность ",seance.duration);
    }
    // for (const seance of this.seances) {

    //   const movie = await Fetch.send("GET", `movie/${seance.movie_id}`);
    //   seance.duration = movie.duration;
    //   console.log(seance.duration);
    // }
  }

  // Метод исключает занятые интервалы из массива доступного времени
  calculateAvailableTime() {
    const timeBoundaries = this.getTimeBoundaries();
    this.availableTime.forEach((hour, idxHour) => {
      hour.forEach((minutes, idxMinutes) => {
        timeBoundaries.forEach((timeBoundarie) => {
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
    // с учетом длины фильма
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

  // Метод возвращает границы начала и конца для каждого сеанса
  getTimeBoundaries() {
    const timeBoundaries = [];

    this.seances.forEach((seance) => {
      // Разделяем строку времени начала на часы и минуты
      const [startHour, startMinute] = seance.start.split(":").map(Number);

      // Создаём объект Date для времени начала
      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0, 0); // Устанавливаем часы и минуты, обнуляем секунды и миллисекунды

      // Создаём объект Date для времени окончания, добавляя длительность сеанса в минутах
      const endDate = new Date(startDate.getTime() + seance.duration * 60000);

      // Извлекаем часы и минуты начала и окончания
      const startingHour = startDate.getHours();
      const startingMinutes = startDate.getMinutes();
      const endingHour = endDate.getHours();
      const endingMinutes = endDate.getMinutes();

      // Добавляем информацию о границах времени в массив
      timeBoundaries.push({
        startingHour,
        startingMinutes,
        endingHour,
        endingMinutes,
      });

      // Для отладки: выводим длительность сеанса
      // console.log(`Длительность сеанса: ${seance.duration} минут`);
    });

    return timeBoundaries;
  }

  // Метод формирует человекочитаемые строки из доступного времени
  getAvailableTimeStrings() {
    let startValue; // Время начала интервала
    let endValue; // Время окончания интервала
    let isStart = false; // Флаг начала блока
    this.availableTime = [];

    // Проход по массиву доступного времени
    for (let i = 0; i < this.availableTime.length; i += 1) {
      for (let j = 0; j < this.availableTime[i].length; j += 1) {
        const current = this.availableTime[i][j];

        if (current || current === 0) {
          // Обработка 0, чтобы избежать пропуска
          if (current === 0) this.availableTime[i][j] = "00";

          // Начало нового интервала
          if (!isStart) {
            isStart = true;
            startValue =
              i < 10
                ? `0${i}:${this.availableTime[i][j]}`
                : `${i}:${this.availableTime[i][j]}`;
          }

          // Обновление времени окончания
          endValue =
            i < 10
              ? `0${i}:${this.availableTime[i][j]}`
              : `${i}:${this.availableTime[i][j]}`;
        } else {
          // Если интервал закончился — сохраняем его
          if (isStart) {
            this.availableTime.push(`с ${startValue} по ${endValue}`);
          }
          isStart = false;
        }
      }
    }

    // Если последний интервал не завершился — добавляем его
    if (isStart) {
      this.availableTime.push(`с ${startValue} по ${endValue}`);
      console.log(this.availableTimeavailableTime);
    }

    return this.availableTime; // Возвращаем список строк с интервалами
  }
}
