# Фронтенд js  

## Инструкции

## 1. для запуска пакетного файла выполнить npm install

## 2. указать адрес сервера в двух app.js файлах директорий admin и client

## 2. на пример в app.js  export const _URL = "<http://127.0.0.1:80/api/>"; для бэкенда в XAMPP ПОРТ 80

## 3. запустить сервер в сценариях NPM start live-server ОТКРОЕТСЯ СТРАНИЦА ПРИЛОЖЕНИЯ! САЙТ

* * *
Объект HallList {
  containerEl: [элемент DOM],
  objectId: 1,
  halls: [],
  activeHallId: null,
  handlerUpdate: null,
  mainEl: null
}

* * *
Объект Hallconfiguration {
  "halls": [
    { "Id": 1, "name": "Зал 1" },
    { "Id": 2, "name": "Зал 2" }
  ],
  "activeHallId": null,
  "selectedElement": null,
  "chairs": [],
  "chairsCopy": [],
  "hallList": { /* объект HallList */ },
  "hallSize": { /* объект HallSize */ },
  "containerEl": { /* DOM элемент .hall-configuration */ },
  "hallsListEl": { /* DOM элемент .hall-configuration-halls-list */ },
  "hallEl": { /* DOM элемент .conf-step__hall-wrapper */ },
  "modalEl": { /* DOM элемент .modal-chair-type */ },
  "btnCancelEl": { /* DOM элемент .hall-configuration-btn-cancel */ },
  "btnSaveEl": { /* DOM элемент .hall-configuration-btn-save */ }
}

* * *
Объект HallSize {
  rows: 10,
  places: 15
}

* * *
Объект HallManagement {
  "halls": [
    {
      "id": 1,
      "name": "Зал 1",
      "ticket_price": 500,
      "vip_ticket_price": 1000,
      "sales": false
    },
    {
      "id": 2,
      "name": "Зал 2",
      "ticket_price": 600,
      "vip_ticket_price": 1200,
      "sales": true
    }
  ],
  "mainEl": "<div class='main'>...</div>",
  "containerEl": "<div class='hall-management'>...</div>",
  "btnCreateHallEl": "<button class='create-hall'>Создать зал</button>",
  "hallListEl": "<ul class='hall-list'>...</ul>",
  "modalEl": "<div class='modal-create-hall'>...</div>",
  "modalBtnCloseEl": "<button class='modal-create-hall__btn-close'>Закрыть</button>",
  "modalInputEl": "<input class='modal-create-hall__input' type='text'>",
  "modalFormEl": "<form class='modal-create-hall__form'>...</form>"
}

* * *
