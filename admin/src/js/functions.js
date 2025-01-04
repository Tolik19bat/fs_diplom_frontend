import { _URL } from "./app.js";

export function dispatchUpdateEvent(arg) {
    const event = new CustomEvent("updateHall", {
        detail: arg
    });
    document.querySelector(".main").dispatchEvent(event);

    // document.querySelector(".main").addEventListener("updateHall", (event) => {
    //     console.log("Данные события:", event.detail);
    // });
}

export async function getHalls(activHallId = null) {
    const token = localStorage.getItem('token');
    try {
        const jsonResponse = await fetch(`${_URL}hall`, {
            method: "GET",
            headers: { Autorization: `Bearer ${token}` },
        });
        const response = await jsonResponse.json();
        if (!response.length) {
            return console.log("Нет данных о залах, массив пуст");
        }
        if (!activHallId) {
            activHallId = response[0].id;
        }
    } catch (error) {
        console.log(error);
    }
}
