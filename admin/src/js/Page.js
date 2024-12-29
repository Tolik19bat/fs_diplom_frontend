import accordeon from "./accordeon.js";
import { getHalls } from "./functions.js";
import HallManagement from "./HallManagement.js";

export default class Page {
    constructor(container) {
        this.containerEl = container;
        this.halls = [];
        this.accordeon = accordeon();
    }

    init() {
        this.accordeon;
        this.hallManagement = new HallManagement();
        getHalls();
    }


}

