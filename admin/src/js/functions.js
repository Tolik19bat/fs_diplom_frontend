import { _URL } from "./app.js";
import Fetch from "./Fetch.js";

// Функция для создания и отправки пользовательского события 'updateHall' с дополнительными данными
export function dispatchUpdateEvent(arg) {
  // Создаём новое пользовательское событие с типом 'updateHall' и передаем аргумент как детализированные данные
  const event = new CustomEvent("updateHall", {
    detail: arg, // Внутреннее свойство 'detail' содержит переданные данные
  });

  // Находим элемент с классом '.main' и отправляем на него событие
  document.querySelector(".main").dispatchEvent(event);

  // Добавляем обработчик события 'updateHall' на элемент '.main'
  // document.querySelector(".main").addEventListener("updateHall", (event) => {
  //   // Когда событие 'updateHall' сработает, выводим данные из события в консоль
  //   console.log("Данные события:", event.detail);
  // });
}

// Асинхронная функция для получения данных о залах
export async function getHalls(activeHallId = null) {
  let response; // Объявляем переменную `response`, в которую будет сохранен результат запроса
  await Fetch.send("GET", "hall").then((resolve) => (response = resolve)); // Отправляем асинхронный GET-запрос на сервер для получения списка залов
  // Используем `then()`, чтобы присвоить полученный результат переменной `response` после завершения запроса

  if (response.length > 0 && !activeHallId) { // Проверяем, содержит ли `response` хотя бы один элемент и не задан ли `activeHallId`
    activeHallId = response[0].id; // Если `activeHallId` не установлен, присваиваем ему ID первого зала из списка
  }
  
  dispatchUpdateEvent({ // Вызываем функцию `dispatchUpdateEvent`, передавая ей объект с обновленными данными
    data: response, // Передаем полученные данные о залах
    activeHallId, // Передаем актуальный ID активного зала
  });

  // Получаем токен авторизации из localStorage
  // const token = localStorage.getItem("token");

  // try {
  //   // Выполняем запрос на сервер для получения информации о залах
  //   const jsonResponse = await fetch(`${_URL}hall`, {
  //     method: "GET", // Метод запроса - GET
  //     headers: { Authorization: `Bearer ${token}` }, // Заголовок Authorization для передачи токена
  //   });

  //   // Преобразуем ответ в формат JSON
  //   const response = await jsonResponse.json();

  //   // Если id активного зала не передан, то выбираем первый зал из ответа
  //   if (response.length > 0 && !activeHallId) {
  //     activeHallId = response[0].id;
  //   }
  //   // Отправляем событие обновления с переданными данными
  //   dispatchUpdateEvent({
  //     data: response, // Передаём полученные данные
  //     activeHallId, // Передаём ID активного зала, чтобы обновить его состояние
  //   });
  // } catch (error) {
  //   // В случае ошибки выводим её в консоль
  //   console.log(error);
  // }
}
