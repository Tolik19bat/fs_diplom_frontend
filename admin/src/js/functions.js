import { _URL } from "./app.js";

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
  // Получаем токен авторизации из localStorage
  const token = localStorage.getItem("token");

  try {
    // Выполняем запрос на сервер для получения информации о залах
    const jsonResponse = await fetch(`${_URL}hall`, {
      method: "GET", // Метод запроса - GET
      headers: { Authorization: `Bearer ${token}` }, // Заголовок Authorization для передачи токена
    });

    // Преобразуем ответ в формат JSON
    const response = await jsonResponse.json();

    // Если id активного зала не передан, то выбираем первый зал из ответа
    if (response.length > 0 && !activeHallId) {
      activeHallId = response[0].id;
    }
    // Отправляем событие обновления с переданными данными
    dispatchUpdateEvent({
      data: response, // Передаём полученные данные
      activeHallId, // Передаём ID активного зала, чтобы обновить его состояние
    });
  } catch (error) {
    // В случае ошибки выводим её в консоль
    console.log(error);
  }
}
