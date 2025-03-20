// Импортируем URL API из файла app.js
import { _URL } from "./app.js";

// Импортируем класс Loader для отображения загрузчика
import Loader from "./Loader.js";

// Экспортируем класс Fetch для выполнения HTTP-запросов
export default class Fetch {
  // Статический метод send для выполнения HTTP-запросов
  static async send(method, query, options = {}) {
    // Запускаем индикатор загрузки
    Loader.startLoader();

    // Получаем токен из localStorage (например, для авторизации)
    const token = localStorage.getItem("token");

    try {
      // Формируем объект с параметрами запроса
      const requestOptions = {
        method, // HTTP-метод (GET, POST, PUT, DELETE и т. д.)
        headers: {
           Authorization: `Bearer ${token}` 
          }, // Добавляем заголовок Authorization с токеном
      };

      // Если переданы данные в формате FormData
      if (options?.formData) {
        // Если необходимо добавить параметр `_method=PUT` (имитация PUT-запроса для серверов, поддерживающих только POST)
        if (options?.addPut) {
          options.formData.append("_method", "PUT");
        }
        requestOptions.body = options.formData; // Устанавливаем FormData в тело запроса
      }

      // Если переданы данные в формате JSON
      if (options?.bodyJson) {
        requestOptions.body = JSON.stringify(options.bodyJson); // Преобразуем объект в JSON-строку
        requestOptions.headers["Content-Type"] = "application/json"; // Добавляем заголовок Content-Type
      }

      // Логируем запрос перед отправкой
      // console.log("Запрос admin:", {
      //   url: _URL + query,
      //   method: requestOptions.method,
      //   headers: requestOptions.headers,
      //   body: requestOptions.body ? requestOptions.body : "нет тела запроса",
      // });

      // Выполняем запрос к серверу
      const response = await fetch(_URL + query, requestOptions);
      
      // console.log("Ответ:", response);

      // Если нужен "сырой" ответ, просто возвращаем объект Response
      if (options?.cleanResponse) {
        Loader.stopLoader();
        return response;
      }

      // Если ответ в формате JSON, парсим его и возвращаем
      if (response.headers.get("content-type") === "application/json") {
        Loader.stopLoader();
        return await response.json();
      }

      // Если ответ содержит текст, возвращаем его в виде строки
      if (
        response.headers.get("content-type") &&
        response.headers.get("content-type").includes("text/plain")
      ) {
        Loader.stopLoader();
        return await response.text();
      }

      // Останавливаем индикатор загрузки в любом случае
      Loader.stopLoader();
    } catch (error) {
      // Выводим ошибку в консоль, если запрос завершился с ошибкой
      console.error(error);
    }
  }
}
