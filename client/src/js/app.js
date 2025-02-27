import Page from "./Page.js";
import Loader from "./Loader.js";

export const _URL = "http://127.0.0.1:80/api/";

export const _URL_HALL = "/client/src/html/hall.html";

export const _URL_PAYMENT = "/client/src/html/payment.html";

export const _URL_TICKET = "/client/src/html/ticket.html";

if (location.pathname === "/" || location.pathname === "/index.html") {
  Loader.init();
  const page = new Page();
  console.log(page);
}
