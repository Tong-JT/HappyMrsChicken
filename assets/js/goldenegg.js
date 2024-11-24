export function getRandomGoldenEggTime() {
    return Math.random() * (1800 - 1200) + 1200;
}

export function createGoldenEgg() {
    let xPos = Math.random() * (screen.width - 0) + 0;
    let yPos = Math.random() * (screen.height - 0) + 0;
    let egg = document.createElement('div');
    egg.innerHTML = `<img src="/assets/images/goldenegg.png" class="golden-egg" />`;
    egg.querySelector('img').style.left = `${xPos}px`;
    egg.querySelector('img').style.top = `${yPos}px`;
    document.body.appendChild(egg);

    let eggDespawnTime = 10000;
    let despawnTimer = setTimeout(() => egg.remove(), eggDespawnTime);

    egg.addEventListener('click', () => {
        clearTimeout(despawnTimer);
        egg.remove();
    });

    setTimeout(createGoldenEgg, getRandomGoldenEggTime());
}
