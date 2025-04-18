// Импортируем модуль Fetch для выполнения HTTP-запросов
import Fetch from "./Fetch.js";

export default class SeancesTime {
  constructor(hallId, movie) {
    this.hallId = hallId;
    this.movieId = movie.id;
    this.movieDuration = +movie.duration;
    this.movieCache = {};
    this.seances = [];
    this.availableTime = [];
    this.init();
  }

  init() {
    this.availableTime = SeancesTime.initSampleAvailableTime();
  }

  async getAvailableTime() {
    await this.getSeances();
    this.calculateAvailableTime();
    
    // После всех расчетов выводим сеансы через полночь
    this.logMidnightCrossingSeances();
    
    return {
      availableTime: this.availableTime,
      strings: this.getAvailableTimeStrings(),
    };
  }

  static initSampleAvailableTime() {
    const time = [];
    for (let i = 0; i < 24; i += 1) {
      const minutes = [];
      for (let j = 0; j < 60; j += 10) {
        minutes.push(j);
      }
      time.push(minutes);
    }
    return time;
  }

  async getSeances() {
    this.seances = await Fetch.send("GET", `hall/${this.hallId}/seances`);
    for (const seance of this.seances) {
      if (!this.movieCache[seance.movie_id]) {
        this.movieCache[seance.movie_id] = await Fetch.send("GET", `movie/${seance.movie_id}`);
      }
      seance.duration = this.movieCache[seance.movie_id].duration;
    }
  }

  calculateAvailableTime() {
    const timeBoundaries = this.getTimeBoundaries();

    this.availableTime.forEach((hour, hourIdx) => {
      hour.forEach((minute, minuteIdx) => {
        timeBoundaries.forEach((tb) => {
          if (tb.crossesMidnight) {
            this.processMidnightCrossing(hourIdx, minuteIdx, hour, minute, tb);
          } else {
            this.processRegularSeance(hourIdx, minuteIdx, hour, minute, tb);
          }
        });
      });
    });

    this.removeShortTimeSlots();
  }

  processRegularSeance(hourIdx, minuteIdx, hour, minute, tb) {
    if (hourIdx >= tb.startingHour && hourIdx <= tb.endingHour) {
      if (hourIdx === tb.startingHour && hourIdx !== tb.endingHour) {
        if (minute >= tb.startingMinutes) delete hour[minuteIdx];
      } else if (hourIdx > tb.startingHour && hourIdx < tb.endingHour) {
        delete hour[minuteIdx];
      } else if (hourIdx !== tb.startingHour && hourIdx === tb.endingHour) {
        if (minute <= tb.endingMinutes) delete hour[minuteIdx];
      } else if (hourIdx === tb.startingHour && hourIdx === tb.endingHour) {
        if (minute >= tb.startingMinutes && minute <= tb.endingMinutes) {
          delete hour[minuteIdx];
        }
      }
    }
  }

  processMidnightCrossing(hourIdx, minuteIdx, hour, minute, tb) {
    // До полуночи
    if (hourIdx >= tb.startingHour && hourIdx <= 23) {
      if (hourIdx === tb.startingHour && minute >= tb.startingMinutes) {
        delete hour[minuteIdx];
      } else if (hourIdx > tb.startingHour) {
        delete hour[minuteIdx];
      }
    }
    // После полуночи
    else if (hourIdx >= 0 && hourIdx <= tb.endingHour) {
      if (hourIdx === tb.endingHour && minute <= tb.endingMinutes) {
        delete hour[minuteIdx];
      } else if (hourIdx < tb.endingHour) {
        delete hour[minuteIdx];
      }
    }
  }

  removeShortTimeSlots() {
    let durationCounter = 0;
    let isBlockStarted = false;
    
    for (let hourIdx = this.availableTime.length - 1; hourIdx >= 0; hourIdx -= 1) {
      for (let minuteIdx = this.availableTime[hourIdx].length - 1; minuteIdx >= 0; minuteIdx -= 1) {
        const currentMinute = this.availableTime[hourIdx][minuteIdx];
        if (currentMinute !== undefined) {
          if (isBlockStarted) {
            if (durationCounter < this.movieDuration) {
              delete this.availableTime[hourIdx][minuteIdx];
            }
            durationCounter += 10;
          }
        } else {
          durationCounter = 0;
          isBlockStarted = true;
        }
      }
    }
  }

  getTimeBoundaries() {
    const timeBoundaries = [];
    
    this.seances.forEach((seance) => {
      const [startingHourStr, startingMinutesStr] = seance.start.split(':');
      let startingHour = parseInt(startingHourStr, 10);
      let startingMinutes = parseInt(startingMinutesStr, 10);
      
      const duration = parseInt(seance.duration, 10);
      const hoursDuration = Math.floor(duration / 60);
      const minutesDuration = duration % 60;
      
      let endingHour = startingHour + hoursDuration;
      let endingMinutes = startingMinutes + minutesDuration;
      
      if (endingMinutes >= 60) {
        endingMinutes -= 60;
        endingHour += 1;
      }
      
      // Определяем, пересекает ли сеанс полночь
      const crossesMidnight = endingHour >= 24;
      if (crossesMidnight) {
        endingHour -= 24;
      }
      
      timeBoundaries.push({
        startingHour,
        startingMinutes,
        endingHour,
        endingMinutes,
        crossesMidnight,
        seanceData: seance // Сохраняем данные сеанса для логирования
      });
    });
    
    return timeBoundaries;
  }

  logMidnightCrossingSeances() {
    const midnightSeances = this.seances.filter(seance => {
      const [startHour] = seance.start.split(':').map(Number);
      const duration = parseInt(seance.duration, 10);
      const endTotalMinutes = startHour * 60 + duration;
      return endTotalMinutes >= 1440; // 24 * 60
    });

    if (midnightSeances.length > 0) {
      console.log('Сеансы, пересекающие полночь:');
      midnightSeances.forEach(seance => {
        const [startHour, startMinute] = seance.start.split(':').map(Number);
        const duration = parseInt(seance.duration, 10);
        const endTotalMinutes = startHour * 60 + startMinute + duration;
        const endHour = Math.floor((endTotalMinutes % 1440) / 60);
        const endMinute = endTotalMinutes % 60;
        
        const hoursAfterMidnight = Math.floor((endTotalMinutes - 1440) / 60);
        const minutesAfterMidnight = (endTotalMinutes - 1440) % 60;
        
        console.log(`- Фильм: ${this.movieCache[seance.movie_id].title}`);
        console.log(`  Начало: ${seance.start}`);
        console.log(`  Длительность: ${duration} мин (${Math.floor(duration/60)}ч ${duration%60}мин)`);
        console.log(`  Окончание: ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`);
        console.log(`  Время после полуночи: ${hoursAfterMidnight}ч ${minutesAfterMidnight}мин`);
        console.log('----------------------------------');
      });
    }
  }

  getAvailableTimeStrings() {
    const availableStrings = [];
    let currentBlock = null;
    
    for (let hourIdx = 0; hourIdx < this.availableTime.length; hourIdx++) {
      for (let minuteIdx = 0; minuteIdx < this.availableTime[hourIdx].length; minuteIdx++) {
        const minute = this.availableTime[hourIdx][minuteIdx];
        
        if (minute !== undefined) {
          const formattedHour = hourIdx.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          const timeStr = `${formattedHour}:${formattedMinute}`;
          
          if (!currentBlock) {
            currentBlock = { start: timeStr, end: timeStr };
          } else {
            currentBlock.end = timeStr;
          }
        } else if (currentBlock) {
          availableStrings.push(`с ${currentBlock.start} по ${currentBlock.end}`);
          currentBlock = null;
        }
      }
    }
    
    if (currentBlock) {
      availableStrings.push(`с ${currentBlock.start} по ${currentBlock.end}`);
    }
    
    return availableStrings;
  }
}