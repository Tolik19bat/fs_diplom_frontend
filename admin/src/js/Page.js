import accordeon from "./accordeon.js";
import HallManagement from "./HallManagement.js";

export default class Page {
    constructor(container) {
        this.containerEl = container;
        this.halls = [];
        console.log();
        this.accordeon = accordeon();
    }

    init() {
        this.accordeon;
        this.hallManagement = new HallManagement();

    }
}

