function showSlideMessage(message, color, duration = 2000) {
    const slideMessage = document.getElementById("slideMessage");
    slideMessage.innerHTML = message;
    slideMessage.classList.remove("hide");
    slideMessage.classList.add("show");
    slideMessage.style.backgroundColor = color;
    setTimeout(() => {
        slideMessage.classList.add("hide");
        setTimeout(() => {
            slideMessage.classList.remove("show");
            slideMessage.classList.add("hide");
        }, 300);
    }, duration);
}

export {showSlideMessage}