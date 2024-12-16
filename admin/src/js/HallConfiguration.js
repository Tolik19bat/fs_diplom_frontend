export default class HallConfiguration {
    constructor() {
        this.activeHallId = null;
        this.selectedElement = null;
        this.chairs = [];
        this.chairsCopy = [];
        this.init();
    }

    init() {
        this.bindToDom();
        this.hallList = new HallList(this.hallsListEl);
        this.hallList.handlerUpdate = this.renderConfigurationOptions.bind(this);
        this.hallSize = new HallSize();
        this.hallSize.handlerCangeSize = this.changeSize.bind(this);
    }

    bindToDom() {
        this.containerEl = document.querySelector(".hall-configuration");

        this.hallsListEl = this.containerEl.querySelector(".hall-configuration-halls-list");

        this.hallEl = this.containerEl.querySelector(".conf-step__hall-wrapper");

        this.modalEl = this.containerEl.querySelector(".modal-chair-type");

        this.onClickModal = this.onClickModal.bind(this);

        this.modalEl.addEventListener("click", this.onClickModal);

        this.btnCancelEl = this.containerEl.querySelector(".hall-configuration-btn-cancel");
        this.onClickBtnCancel = this.onClickBtnCancel.bind(this);

        this.btnCancelEl.addEventListener("click", this.onClickBtnCancel);

        this.btnSaveEl = this.containerEl.querySelector(".hall-configuration-btn-save");

        this.onClickBtnSave = this.onClickBtnSave.bind(this);
        this.btnSaveEl.addEventListener("click", this.onClickBtnSave);
    }

    renderConfigurations(activeHall) {

    }

    
}