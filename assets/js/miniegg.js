export function createEggAtClick(event) {
    let mouseX = event.pageX;
    let mouseY = event.pageY;
    let egg = document.createElement('div');
    egg.innerHTML = `
        <img src="assets/images/egg.png" class="egg" />
    `;
    let eggHorizontal = Math.random() * (28 - 8) + 8;
    egg.querySelector('img').style.left = `${mouseX - eggHorizontal}px`;
    egg.querySelector('img').style.top = `${mouseY + 2}px`;
    document.body.appendChild(egg);
    egg.addEventListener('animationend', () => {
        egg.remove();
    });
}