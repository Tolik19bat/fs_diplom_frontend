import { _URL } from "./app.js";

// Определяем класс для управления модальным окном сеанса
export default class SeanceModal {
  // Статические свойства для хранения элементов DOM и ID сеанса
  static containerEl; // Контейнер модального окна
  static btnCloseEl; // Кнопка для закрытия модального окна
  static btnRemoveEl; // Кнопка для удаления сеанса
  static seanceId; // ID текущего сеанса

  // Метод инициализации, связывает элементы DOM с обработчиками событий
  static init() {
    SeanceModal.bindToDom(); // Привязка элементов DOM
  }

  // Связывает элементы DOM с классом и добавляет обработчики событий
  static bindToDom() {
    SeanceModal.containerEl = document.querySelector(".modal-seance"); // Находим контейнер модального окна
    SeanceModal.btnCloseEl = SeanceModal.containerEl.querySelector(
      ".modal-seance__btn-close"
    ); // Кнопка закрытия
    // Добавляем обработчик события клика для закрытия модального окна
    SeanceModal.btnCloseEl.addEventListener(
      "click",
      SeanceModal.onClickBtnClose
    );
    SeanceModal.btnRemoveEl = SeanceModal.containerEl.querySelector(
      ".modal-seance__btn-remove-seance"
    ); // Кнопка удаления
    // Добавляем обработчик события клика для удаления сеанса
    SeanceModal.btnRemoveEl.addEventListener(
      "click",
      SeanceModal.onClickBtnRemove
    );
  }

  // Показывает модальное окно, устанавливая ID сеанса и удаляя класс "hidden"
  static showModal(seanceId) {
    SeanceModal.seanceId = seanceId; // Сохраняем ID сеанса
    SeanceModal.containerEl.classList.remove("hidden"); // Показываем модальное окно
  }

  // Скрывает модальное окно, добавляя класс "hidden"
  static hideModal() {
    SeanceModal.containerEl.classList.add("hidden"); // Скрываем модальное окно
  }

  // Обработчик клика для кнопки закрытия
  static onClickBtnClose() {
    SeanceModal.hideModal(); // Закрываем модальное окно
  }

  // Обработчик клика для кнопки удаления сеанса
  static onClickBtnRemove() {
    // Удаляем сеанс и после этого обновляем список сеансов
    SeanceModal.removeSeance().then(() => {
      SeanceModal.hideModal(); // Закрываем модальное окно
      SeanceModal.updateHallsSeances(); // Обновляем список сеансов
    });
  }

  // Создает и вызывает событие для обновления списка сеансов
  static updateHallsSeances() {
    const event = new CustomEvent("updateHallsSeances"); // Создаем пользовательское событие
    document.querySelector(".main").dispatchEvent(event); // Отправляем событие для элемента .main
  }

  // Асинхронный метод для удаления сеанса с использованием API
  static async removeSeance() {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    try {
      const jsonResponse = await fetch(
        `${_URL}seance/${SeanceModal.seanceId}`,
        {
          method: "DELETE", // Метод удаления
          headers: {
            "Content-Type": "application/json", // Заголовок типа контента
            Authorization: `Bearer ${token}`, // Авторизация с использованием токена
          },
        }
      );
    } catch (error) {
      console.error(error); // Логируем ошибки, если они возникли
    }
  }
}
