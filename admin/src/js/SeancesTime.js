// Импортируем модуль Fetch для выполнения HTTP-запросов
import Fetch from "./Fetch.js";

// Экспортируем класс SeancesTime как модуль по умолчанию
export default class SeancesTime {
  // Конструктор принимает ID зала и объект фильма
  constructor(hallId, movie) {
    this.hallId = hallId; // Сохраняем ID зала
    this.movieId = movie.id; // Сохраняем ID фильма
    this.movieDuration = +movie.duration; // Преобразуем длительность фильма в число и сохраняем
    this.seances = []; // Инициализируем массив для хранения уже существующих сеансов
    this.availableTime = []; // Инициализируем массив для хранения доступного времени
    this.init(); // Вызываем метод инициализации доступного времени
  }

  // Метод инициализирует массив доступного времени
  init() {
    this.availableTime = SeancesTime.initSampleAvailableTime(); // Получаем стандартные интервалы времени и сохраняем
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
      const movie = await Fetch.send("GET", `movie/${seance.movie_id}`);
      seance.duration = movie.duration;
      console.log(seance.duration);
    }
  }

  // Метод исключает занятые интервалы из массива доступного времени
  calculateAvailableTime() {
    const timeBoundaries = this.getTimeBoundaries(); // Получаем границы времени каждого сеанса

    // Проходим по каждому часу и минуте
    this.availableTime.forEach((hour, idxHour) => {
      hour.forEach((minutes, idxMinutes) => {
        // Проверяем каждое занятие
        timeBoundaries.forEach((tb) => {
          // Условие: если текущий час попадает в диапазон занятого времени
          if (idxHour >= tb.startingHour && idxHour <= tb.endingHour) {
            // Начало диапазона
            if (idxHour === tb.startingHour && idxHour !== tb.endingHour) {
              if (minutes >= tb.startingMinutes) {
                delete hour[idxMinutes]; // Удаляем время начала
              }
            }
            // Полностью внутри диапазона
            if (idxHour > tb.startingHour && idxHour < tb.endingHour) {
              delete hour[idxMinutes];
            }
            // Конец диапазона
            if (idxHour !== tb.startingHour && idxHour === tb.endingHour) {
              if (minutes <= tb.endingMinutes) {
                delete hour[idxMinutes];
              }
            }
            // Диапазон начинается и заканчивается в одном часу
            if (idxHour === tb.startingHour && idxHour === tb.endingHour) {
              if (
                minutes >= tb.startingMinutes &&
                minutes <= tb.endingMinutes
              ) {
                delete hour[idxMinutes];
              }
            }
          }

          // Отдельная обработка для сеансов, которые проходят через полночь
          if (tb.startingHour > tb.endingHour) {
            // До полуночи
            if (idxHour >= tb.startingHour && idxHour <= 23) {
              if (
                idxHour === tb.startingHour &&
                minutes >= tb.startingMinutes
              ) {
                delete hour[idxMinutes];
              }
              if (idxHour > tb.startingHour) {
                delete hour[idxMinutes];
              }
            }
            // После полуночи
            if (idxHour >= 0 && idxHour <= tb.endingHour) {
              if (idxHour === tb.endingHour && minutes <= tb.endingMinutes) {
                delete hour[idxMinutes];
              }
              if (idxHour < tb.endingHour) {
                delete hour[idxMinutes];
              }
            }
          }
        });
      });
    });

    // Удаляем интервалы, которые не вмещают длительность фильма (с конца массива)
    let counter = 0;
    let isStart = false;
    for (let i = this.availableTime.length - 1; i >= 0; i -= 1) {
      for (let j = this.availableTime[i].length - 1; j >= 0; j -= 1) {
        const current = this.availableTime[i][j];
        if (current || current === 0) {
          if (isStart === true) {
            if (counter < this.movieDuration) {
              delete this.availableTime[i][j];
            }
            counter += 10; // Увеличиваем счётчик времени
          }
        } else {
          counter = 0; // Сброс счётчика
          isStart = true; // Начинаем новый блок
        }
      }
    }
  }

  // Метод возвращает границы начала и конца для каждого сеанса
  getTimeBoundaries() {
    const timeBoundaries = [];
    
    this.seances.forEach((seance) => {
      const colonIdx = seance.start.indexOf(":");
      const startingHour = +seance.start.slice(0, colonIdx);
      const startingMinutes = +seance.start.slice(colonIdx + 1);
      
      // Используем длительность из сеанса, а не текущего фильма!
      const hoursDuration = Math.trunc(seance.duration / 60);
      const minutesDuration = seance.duration % 60;
  
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
    
    console.log("Corrected time boundaries:", timeBoundaries);
    return timeBoundaries;
  }

  // Метод формирует человекочитаемые строки из доступного времени
  getAvailableTimeStrings() {
    let startValue; // Время начала интервала
    let endValue; // Время окончания интервала
    let isStart = false; // Флаг начала блока
    const availableTime = [];

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
            availableTime.push(`с ${startValue} по ${endValue}`);
          }
          isStart = false;
        }
      }
    }

    // Если последний интервал не завершился — добавляем его
    if (isStart) {
      availableTime.push(`с ${startValue} по ${endValue}`);
    }

    return availableTime; // Возвращаем список строк с интервалами
  }
}
