import { _URL } from "./app.js";
import Loader from "./Loader.js";

export default class Fetch {
  // Создаем класс Fetch для выполнения HTTP-запросов
  static async send(method, query, options = {}) {
    // Статический метод send для отправки запросов
    Loader.startLoader(); // Запускаем индикатор загрузки перед выполнением запроса
    try {
      const requestOptions = {
        // Формируем объект с параметрами запроса
        method, // HTTP-метод (GET, POST, PUT, DELETE и т. д.)
        headers: {}, // Заголовки запроса (по умолчанию пустые)
      };

      // Если передан formData, добавляем его в тело запроса
      if (options?.formData) {
        requestOptions.body = options.formData;
      }

      // Если передан bodyJson, сериализуем его в JSON и устанавливаем соответствующий заголовок
      if (options?.bodyJson) {
        requestOptions.body = JSON.stringify(options.bodyJson);
        requestOptions.headers["Content-Type"] = "application/json";
      }

      // Логируем запрос перед отправкой
      console.log("Запрос client:", {
        url: _URL + query,
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body ? requestOptions.body : "нет тела запроса",
      });
      
      // Выполняем HTTP-запрос с указанным URL и опциями
      const response = await fetch(_URL + query, requestOptions);

      console.log("Отклик client", response);

      // Если указано cleanResponse, возвращаем "сырой" Response-объект без обработки
      if (options?.cleanResponse) {
        Loader.stopLoader(); // Останавливаем индикатор загрузки
        return response;
      }

      // Если сервер вернул JSON-ответ, парсим его и возвращаем
      if (response.headers.get("content-type") === "application/json") {
        Loader.stopLoader();
        return await response.json();
      }

      // Если сервер вернул текстовый ответ, читаем его и возвращаем
      if (response.headers.get("content-type").includes("text/plain")) {
        Loader.stopLoader();
        return await response.text();
      }

    // Если заголовок content-type отсутствует или не распознан, возвращаем текст
    const data = await response.text();
    Loader.stopLoader();
    return data;
    } catch (error) {
      // Обрабатываем возможные ошибки при выполнении запроса
      console.error(error); // Выводим ошибку в консоль
    }
  }
}
