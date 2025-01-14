// Экспортируем класс HallSize  
export default class HallSize {  
  // Конструктор класса  
  constructor() {  
      this.init(); // инициализация логики класса  
      this.handlerChangeSize = null; // обработчик изменения размера  
  }  

  // Инициализация метода  
  init() {  
      this.bindToDom(); // связываем DOM-элементы с методами  
  }  

  // Метод для связывания DOM-элементов  
  bindToDom() {  
      this.countRowsEl = document.querySelector(".count-rows"); // находим элемент для количества рядов  
      console.log(this.countRowsEl); // выводим элемент в консоль (для отладки)  
      this.onChangeSize = this.onChangeSize.bind(this); // связываем контекст для обработчика  
      this.countRowsEl.addEventListener("input", this.onChangeSize); // добавляем обработчик события изменения для рядов  

      // Находим элемент для количества мест  
      this.countPlacesEl = document.querySelector(".count-places");  
      this.countPlacesEl.addEventListener("input", this.onChangeSize); // добавляем обработчик события изменения для мест  
  }  

  // Метод для отображения размера зала  
  renderHallSize({ rows, places }) {  
      this.countRowsEl.value = rows; // устанавливаем количество рядов  
      this.countPlacesEl.value = places; // устанавливаем количество мест  
  }  

  // Обработчик изменения размера зала  
  onChangeSize() {  
      const rows = this.countRowsEl.value.trim(); // получаем значение рядов  
      const places = this.countPlacesEl.value.trim(); // получаем значение мест  

      // Проверяем, чтобы значения не были пустыми  
      if (rows === "" || places === "") {  
          console.warn("Количество рядов и мест не может быть пустым."); // выводим предупреждение в консоль  
          return; // прерываем выполнение функции  
      }  

      // Вызываем обработчик изменения размера с числовыми значениями  
      this.handlerChangeSize({ rows: Number(rows), places: Number(places) });  
  }  
}