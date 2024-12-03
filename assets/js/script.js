import { initializeSettingsPopup } from './settings.js';
import { createEggAtClick } from './miniegg.js';

initializeSettingsPopup();

let upgrades = null;

async function load() {
    let upgradesContainer = document.getElementById("upgrades-container");
    let theJSON = await fetch("/assets/json/upgrades.json");
    upgrades = await theJSON.json();
    console.log(upgrades);

    for (let upgradeKey in upgrades) {
        let upgrade = upgrades[upgradeKey];

        let upgradeCard = `
        <div class="unit">
                    <div class="multiplier-block">
                <p class="multiplier-text"  id="level-${upgradeKey}"><span class="multiplier">1</span></p>
            </div>
            <div class="upgrade-button" id="button-${upgradeKey}">
                <div class="left">
                    <h4 class="upgrade-name">${upgradeKey} <span class="upgrade-rate">${upgrade.rate}</span></h4>
                    <p class="upgrade-cost-text"><span class="upgrade-cost"> ${upgrade.cost} </span> eggs</p>
                </div>
                <div class="right">
                    <p class="bought-number">0</p>
                </div>
            </div>

        </div>
        `;
        upgradesContainer.innerHTML += upgradeCard;
    }

    for (let j of document.getElementsByClassName("unit")) {
        let upgradeButton = j.querySelector(".upgrade-button");
        let multiplierText = j.querySelector(".multiplier-block");

        upgradeButton.addEventListener("click", clickedButton);
        upgradeButton.addEventListener("mouseover", hoverInfo);
        multiplierText.addEventListener("click", increaseMultiplier);
        multiplierText.addEventListener("mouseover", hoverMultiplierPrice);
    }
}

load();

let eggcount = document.getElementById("egg-count");
let eggrate = document.getElementById("egg-rate");
let eggtotal = document.getElementById("egg-total");

setInterval(addEggs, 1000);

function getRandomGoldenEggTime() {
    return Math.random()  * (300000 - 180000) + 180000;
}

function createGoldenEgg() {
    let xPos = Math.random() * (screen.width - 0) + 0;
    let yPos = Math.random() * (screen.height - 0) + 0;
    let egg = document.createElement('div');
    egg.innerHTML = `<img src="/assets/images/goldenegg.png" class="golden-egg" />`;
    egg.querySelector('img').style.left = `${xPos}px`;
    egg.querySelector('img').style.top = `${yPos}px`;
    document.body.appendChild(egg);

    let eggDespawnTime = 15000;
    let despawnTimer = setTimeout(() => egg.remove(), eggDespawnTime);

    egg.addEventListener('click', () => {
        clearTimeout(despawnTimer);
        egg.remove();
        let randomEvent = Math.floor(Math.random() * 3);

        if (randomEvent === 0) {
            goldClickFixedEggs();
        } else if (randomEvent === 1) {
            goldClickRateFrenzy();
        } else {
            goldClickClickFrenzy();
        }
    });

    setTimeout(createGoldenEgg, getRandomGoldenEggTime());
}

function goldClickFixedEggs() {
    let currentEggCount = parseFloat(eggcount.innerText);
    let eggBonus = currentEggCount * (Math.random() * (0.3 - 0.1) + 0.1);
    eggcount.innerText = (currentEggCount + eggBonus).toFixed(1);
    let currentEggTotal = parseFloat(eggtotal.innerText);
    eggtotal.innerText = (currentEggTotal + eggBonus).toFixed(1);
    console.log("click fixed")
}


let originalClickRate = parseFloat(document.getElementById("click-rate").innerText);
let globalMultiplier = 1;

function goldClickRateFrenzy() {
    globalMultiplier = 3;
    console.log("rate frenzy");
    increaseRate();

    setTimeout(() => {
        globalMultiplier = 1;
        increaseRate();
    }, 15000);
}


function goldClickClickFrenzy() {
    let newClickRate = originalClickRate * 7;
    document.getElementById("click-rate").innerText = newClickRate.toFixed(1);
    console.log("click frenzy");

    setTimeout(() => {
        document.getElementById("click-rate").innerText = originalClickRate.toFixed(1);
    }, 10000);
}

createGoldenEgg();

function increaseMultiplier() {
    let multiplierText = this;
    let multiplierValue = parseInt(multiplierText.querySelector('.multiplier').innerText);
    let unitElement = multiplierText.querySelector('.multiplier-text');
    let upgradeKey = unitElement.id.split('-')[1];
    let upgrade = upgrades[upgradeKey];
    let currentEggCount = parseInt(eggcount.innerText);
    let currentLevelPrice = upgrade.levels[multiplierValue];

    if ((multiplierValue < 4) && (currentEggCount >= currentLevelPrice)) {
        multiplierValue++;
        multiplierText.querySelector('.multiplier').innerText = multiplierValue;
        boughtUpgrade(currentLevelPrice);

        if (upgradeKey === "Chicken") {
            let clickRateElement = document.getElementById("click-rate");
            let currentClickRate = parseFloat(clickRateElement.innerText);
            let newClickRate = currentClickRate * 2;
            clickRateElement.innerText = newClickRate;
        }

        if (multiplierValue == 4) {
            this.closest('.multiplier-block').style.backgroundColor = "#f0d71a";
            this.closest('.multiplier-block').querySelector('.multiplier-text').style.color = "#E97451";
        }

        increaseRate();

        this.style.animation = 'pulse-menu 0.3s linear';
        this.addEventListener('animationend', () => {
            this.style.animation = '';
        });
    }
}

function hoverMultiplierPrice() {
    let multiplierText = this;
    let multiplierValue = parseInt(multiplierText.querySelector('.multiplier').innerText);
    let unitElement = multiplierText.querySelector('.multiplier-text');
    let upgradeKey = unitElement.id.split('-')[1];
    let upgrade = upgrades[upgradeKey];
    let level = multiplierValue;
    let levelPrice = upgrade.levels[level];
    let hoverBox = document.createElement('div');
    hoverBox.className = 'hover-box';
    hoverBox.innerHTML = 
        `<p class="hover-item">${upgradeKey} - Level ${level} </p>
        <p class="hover-item">Multiplier: ${Math.pow(2,(level)-1)}x </p>
        <p class="hover-item">Next level: ${levelPrice} eggs</p>`;
    this.closest('.multiplier-block').appendChild(hoverBox);
    multiplierText.addEventListener('mouseout', function() {
        hoverBox.remove();
    });
}

function hoverInfo() {
    let upgradeButton = this;
    let itemNumber = upgradeButton.getElementsByClassName("bought-number")[0];
    let itemRate = upgradeButton.getElementsByClassName("upgrade-rate")[0];
    let multiplierValue = parseInt(upgradeButton.parentNode.querySelector('.multiplier').innerText);
    let eggRate = parseFloat(eggrate.innerText);

    let ratePercentage = 0;
    let totalRate = parseFloat(itemRate.innerText) * parseInt(itemNumber.innerText) * (Math.pow(2, multiplierValue-1));
    if (parseInt(itemNumber.innerText) > 0) {
        ratePercentage = (totalRate / eggRate) * 100;
    }

    let hoverBox = document.createElement('div');
    hoverBox.className = 'hover-box';
    hoverBox.innerHTML = `
        <p class="hover-item">Eggs per second: ${itemRate.innerText}  (x${Math.pow(2, multiplierValue-1)})</p>
        <p class="hover-item">Upgrades bought: ${itemNumber.innerText}</p>
        <p class="hover-item">Total eggs per second: ${totalRate.toFixed(1)}</p>
        <p class="hover-item">% of total rate: ${ratePercentage.toFixed(1)}%</p>
    `;

    upgradeButton.getElementsByClassName('right')[0].appendChild(hoverBox);
    upgradeButton.addEventListener('mouseout', function() {
        hoverBox.remove();
    });
}

function clickedButton() {
    let upgradeButton = this;
    let itemNumber = upgradeButton.getElementsByClassName("bought-number")[0];
    let currentUpgradeCount = parseInt(itemNumber.innerText);
    let itemPrice = upgradeButton.getElementsByClassName("upgrade-cost")[0];
    let currentPrice = parseInt(itemPrice.innerText);
    let currentEggCount = parseInt(eggcount.innerText);
    
    if (currentPrice <= currentEggCount) {
        itemNumber.innerText = currentUpgradeCount + 1;
        increasePrice(this);
        increaseRate();
        upgradeButton.style.animation = 'pulse-menu 0.3s linear';
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
}

function increasePrice(upgradeButton) {
    let itemPrice = upgradeButton.getElementsByClassName("upgrade-cost")[0];
    let currentPrice = parseInt(itemPrice.innerText);
    boughtUpgrade(currentPrice);
    let newPrice = Math.round( currentPrice * 1.15);
    itemPrice.innerText = newPrice;
}

function increaseRate() {
    let totalRate = 0;
    
    for (let upgradeKey in upgrades) {
        let upgrade = upgrades[upgradeKey];
        let upgradeButton = document.getElementById(`button-${upgradeKey}`);
        let boughtAmount = parseInt(upgradeButton.getElementsByClassName("bought-number")[0].innerText);
        let multiplierValue = parseInt(document.getElementById(`level-${upgradeKey}`).querySelector('.multiplier').innerText);
        totalRate += (boughtAmount * upgrade.rate * Math.pow(2, (multiplierValue-1)))*globalMultiplier;
    }
    eggrate.innerText = totalRate.toFixed(1);
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

function clickedMrsChickenIncreaseEgg() {
    let clickrate = document.getElementById("click-rate");
    let clickRate = parseInt(clickrate.innerText);
    let currentEggCount = parseFloat(eggcount.innerText);
    eggcount.innerText = (currentEggCount + clickRate).toFixed(1);
    let currentEggTotal = parseFloat(eggtotal.innerText);
    eggtotal.innerText = (currentEggTotal + clickRate).toFixed(1);
}

function boughtUpgrade(cost) {
    let currentEggCount = parseFloat(eggcount.innerText);
    eggcount.innerText = (currentEggCount - cost).toFixed(1);
}
