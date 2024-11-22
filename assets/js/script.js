let upgrades = null;

async function load() {
    let upgradesContainer = document.getElementById("upgrades-container");
    let theJSON = await fetch("/assets/json/upgrades.json");
    upgrades = await theJSON.json();

    for (let i = 0; i < upgrades.length; i++) {
        let upgrade = upgrades[i]
        let upgradeCard = `
        <div class="upgrade-button" id="button-${upgrade.key}">
            <div class="left">
                <h4 class="upgrade-name">${upgrade.name}<span class="upgrade-rate">${upgrade.rate}</span></h4>
                <p class="upgrade-cost-text"><span class="upgrade-cost"> ${upgrade.cost} </span> eggs</p>
            </div>
            <div class="right">
                <p class="bought-number">${upgrade.number}</p>
            </div>
        </div>
        `
        upgradesContainer.innerHTML += upgradeCard;
    }
    for (let j of document.getElementsByClassName("upgrade-button")) {
        j.addEventListener("click", clickedButton)
    }
}

load()

let eggcount = document.getElementById("egg-count");
let eggrate = document.getElementById("egg-rate");
let eggtotal = document.getElementById("egg-total");

setInterval(addEggs, 1000);

function clickedButton() {
    let upgradeButton = this;
    console.log(upgradeButton.innerHTML)
    let itemNumber = upgradeButton.getElementsByClassName("bought-number")[0];
    let currentUpgradeCount = parseInt(itemNumber.innerText);
    let itemPrice = upgradeButton.getElementsByClassName("upgrade-cost")[0];
    let currentPrice = parseInt(itemPrice.innerText);
    let currentEggCount = parseInt(eggcount.innerText);
    
    if (currentPrice <= currentEggCount) {
        itemNumber.innerText = currentUpgradeCount + 1;
        increasePrice(this);
        increaseRate(this);
        upgradeButton.style.animation = 'pulse-menu 0.1s ease';
        upgradeButton.addEventListener('animationend', () => {
            upgradeButton.style.animation = '';
        });
    }
}

function addEggs() {
    let currentEggCount = parseFloat(eggcount.innerText);
    let eggRate = parseFloat(eggrate.innerText);
    let eggTotal = parseFloat(eggtotal.innerText);
    eggcount.innerText = (currentEggCount + eggRate).toFixed(1);
    eggtotal.innerText = (eggTotal + eggRate).toFixed(1);
    console.log(eggcount.innerText);
}

function increasePrice(upgradeButton) {
    let itemPrice = upgradeButton.getElementsByClassName("upgrade-cost")[0];
    let currentPrice = parseInt(itemPrice.innerText);
    boughtUpgrade(currentPrice);
    let newPrice = Math.round( currentPrice * 1.15);
    itemPrice.innerText = newPrice;
}

function increaseRate(upgradeButton) {
    let itemRate = upgradeButton.getElementsByClassName("upgrade-rate")[0];
    let currentEggRate = parseFloat(itemRate.innerText);
    let eggRate = parseFloat(eggrate.innerText);
    eggrate.innerText = (eggRate + currentEggRate).toFixed(1);
}

let mrschicken = document.getElementById("mrschicken");
mrschicken.addEventListener('click', clickedMrsChicken);

function clickedMrsChicken() {
    mrschicken.style.animation = 'pulse 0.1s ease';
    mrschicken.src = "/assets/images/frame2.png";
    clickedMrsChickenIncreaseEgg();
    createEggAtClick(event);
    mrschicken.addEventListener('animationend', () => {
        mrschicken.style.animation = '';
        mrschicken.src = "/assets/images/frame1.png";
    });
}

function createEggAtClick(event) {
    let mouseX = event.pageX;
    let mouseY = event.pageY;
    let egg = document.createElement('div');
    egg.innerHTML = `
        <img src="/assets/images/egg.png" class="egg" />
    `;
    let eggHorizontal = Math.random() * (28 - 8) + 8;
    egg.querySelector('img').style.left = `${mouseX - eggHorizontal}px`;
    egg.querySelector('img').style.top = `${mouseY + 2}px`;
    document.body.appendChild(egg);
    egg.addEventListener('animationend', () => {
        egg.remove();
    });
}

function clickedMrsChickenIncreaseEgg() {
    let currentEggCount = parseFloat(eggcount.innerText);
    eggcount.innerText = (currentEggCount + 1).toFixed(1);
    let currentEggTotal = parseFloat(eggtotal.innerText);
    eggtotal.innerText = (currentEggTotal + 1).toFixed(1);
}

function boughtUpgrade(cost) {
    let currentEggCount = parseFloat(eggcount.innerText);
    eggcount.innerText = (currentEggCount - cost).toFixed(1);
}