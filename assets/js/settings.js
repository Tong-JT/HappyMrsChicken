export let settingsButton = document.getElementById("settings");
export let popupOverlay = document.getElementById("popupOverlay");
export let closePopupButton = document.getElementById("closePopup");

export function initializeSettingsPopup() {
    settingsButton.addEventListener('click', showPopup);
    closePopupButton.addEventListener('click', closePopup);

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });
}

function showPopup() {
    popupOverlay.style.display = "block";
}

function closePopup() {
    popupOverlay.style.display = "none";
}
