import Page from "./Page.js";

// Определяем базовый URL для API запросов
export const _URL = "http://127.0.0.1:80/api/";

// Определяем URL для главной страницы администратора
export const _URL_ADMIN_INDEX = "/admin/src/html/index.html";

// Ждем полной загрузки DOM перед выполнением кода
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, находится ли пользователь на главной странице администратора
  if (
    location.pathname === "/admin/src/html/" ||
    location.pathname === "/admin/src/html/index.html"
  ) {
    // Находим контейнер с классом .main для инициализации страницы
    const pageContainer = document.querySelector(".main");

    if (pageContainer) {
      // Если контейнер найден, создаем экземпляр класса Page
      const page = new Page(pageContainer);
      page.init(); // Инициализируем страницу
    } else {
      // Если контейнер не найден, выводим сообщение в консоль
      console.log("Элемент .main не найден");
    }
  }
});
