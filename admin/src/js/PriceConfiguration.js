import { _URL } from "./app.js";
import { getHalls } from "./functions.js";
import HallList from "./HallList.js";

export default class PriceConfiguration {
  constructor(halls = []) {
    this.halls = halls; //сохраняем массив
    this.activeHallId = halls[0]?.id; // Идентификатор активного зала
    this.init(); // Инициализация экземпляра класса
    // Логирование созданного объекта
   console.log("Создан новый объект PriceConfiguration:", this);
  }

  // Метод для инициализации логики класса
  init() {
    this.bindToDom(); // Связываем DOM-элементы с методами
    this.hallList = new HallList(this.hallsListEl, this.halls); // Создаем новый экземпляр HallList
    this.hallList.handlerUpdate = this.update.bind(this); // Привязываем обработчик обновления
    this.hallList.init();  // Инициализируем созданный экземпляр HallList, чтобы он начал работу
    // Если есть активный зал, вызываем метод рендеринга цен для этого зала
    if (this.activeHallId) {
      this.renderPrices(this.halls.find(hall => hall.id === this.activeHallId));
    }
  }

  // Метод для связывания DOM-элементов
  bindToDom() {
    // Находим контейнер для настройки цен
    this.containerEl = document.querySelector(".price-configuration");
    // Находим список залов в контейнере
    this.hallsListEl = this.containerEl.querySelector(
      ".price-configuration-halls-list"
    );
    // Находим элемент формы
    this.formEl = document.querySelector(".price-configuration-form");
    // Привязываем обработчик события отправки формы
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.formEl.addEventListener("submit", this.onSubmitForm);
    // Находим элементы для ввода цен билетов
    this.inputTicketPriceEl = document.querySelector(".ticket-price");
    this.inputVipTicketPriceEl = document.querySelector(".vip-ticket-price");
    // Находим кнопку отмены
    this.cancelBtnEl = document.querySelector(
      ".price-configuration-cancel-btn"
    );
    this.onClickCancelBtn = this.onClickCancelBtn.bind(this); // Привязываем контекст
    this.cancelBtnEl.addEventListener("click", this.onClickCancelBtn); // Добавляем обработчик клика
  }

  // Метод для обновления активного зала и цен
  update(activeHall) {
    if (!activeHall) {
      return;
    }
    this.activeHallId = activeHall.id; // Устанавливаем идентификатор активного зала
    this.renderPrices(activeHall); // Отображаем цены для данного зала
  }

  // Метод для отображения цен в соответствующих полях ввода
  renderPrices(hall) {
    this.inputTicketPriceEl.value = ""; // Очищаем поле для цены обычного билета
    this.inputVipTicketPriceEl.value = ""; // Очищаем поле для цены VIP-билета
    this.inputTicketPriceEl.placeholder = hall.ticket_price; // Устанавливаем плейсхолдер для цены обычного билета
    this.inputVipTicketPriceEl.placeholder = hall.vip_ticket_price; // Устанавливаем плейсхолдер для цены VIP-билета
  }

  // Обработчик события отправки формы
  onSubmitForm(e) {
    e.preventDefault(); // Отменяем стандартное поведение отправки формы
    this.setPrices().then(() => {
      // Устанавливаем цены и обновляем список залов
      getHalls(this.activeHallId);
    });
  }

  // Метод для установки цен залов
  async setPrices() {
    const token = localStorage.getItem("token"); // Получаем токен из локального хранилища
    try {
      // Отправляем запрос на обновление цен
      await fetch(`${_URL}hall/prices/${this.activeHallId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
        },
        body: JSON.stringify({
          ticket_price: this.inputTicketPriceEl.value, // Указываем цену обычного билета
          vip_ticket_price: this.inputVipTicketPriceEl.value, // Указываем цену VIP-билета
        }),
      });
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль при возникновении
    }
  }

  // Метод для обработки нажатия кнопки отмены
  onClickCancelBtn(e) {
    e.preventDefault(); // Отменяем стандартное поведение нажатия
    this.inputTicketPriceEl.value = ""; // Очищаем поле для цены обычного билета
    this.inputVipTicketPriceEl.value = ""; // Очищаем поле для цены VIP-билета
  }
}
