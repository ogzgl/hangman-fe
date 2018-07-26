document.body.addEventListener("click", event => {
    if (event.target.nodeName === "BUTTON") {
        alert(event.target.id.toUpperCase() + " pressed.")
    }
});
