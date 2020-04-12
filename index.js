
loadInitInfo = () => {
  createOptions();
  loadAreasInfo('RUB', 'USD');
}

fetchResult = (currency) => {
  return fetch(`https://api.ratesapi.io/api/latest?base=${currency}`)
    .then(result => { return result.json(); })
    .catch(error => { console.log(`Произошла ошибка ${error.message}`); alert("Произошла ошибка, проверьте консоль.") });
}

createOptions = () => {
  turnLoadScreen();
  fetchResult('RUB').then(result => {
    let currencies = Object.getOwnPropertyNames(result.rates);
    let firstSel = document.querySelector('.firstSel');
    let secondSel = document.querySelector('.secondSel');
    currencies.forEach(curr => {
      let optClone1 = createOptClone(curr);
      let optClone2 = createOptClone(curr);
      firstSel.appendChild(optClone1);
      secondSel.appendChild(optClone2);
    })
    turnLoadScreen();
  });
}

createOptClone = (el) => {
  let optClone = document.createElement('option');
  optClone.classList.add('select-opt');
  optClone.value = el;
  optClone.innerText = el;
  return optClone;
}

turnLoadScreen = () => {
  let loadScreen = document.querySelector('.loading-screen');
  let changeSign = document.querySelector('.change-arrow');
  changeSign.classList.toggle('background-changer');
  loadScreen.classList.toggle('background-changer');
}

loadAreasInfo = (curFrom, curTo) => {

  let sumFrom = document.querySelector('.sum-from');
  let sumTo = document.querySelector('.sum-to');
  let rateFrom = document.querySelector('.rate-from');
  let rateTo = document.querySelector('.rate-to');
  turnLoadScreen();
  fetchResult(curFrom).then(result => {
    let rates = result.rates;
    if (sumFrom.value > 0 && sumFrom.value != '') {
      let temp = sumFrom.value;
      sumFrom.value = sumTo.value;
      sumTo.value = temp;
    } else {
      sumFrom.placeholder = 1;
      sumTo.placeholder = Number(1 / rates[curTo]).toFixed(4);
    }
    rateFrom.innerText = `1 ${curFrom} = ${Number(rates[curTo]).toFixed(4)} ${curTo}`;
    rateTo.innerText = `1 ${curTo} = ${Number(1 / rates[curTo]).toFixed(4)} ${curFrom}`;

    turnLoadScreen()
  });
}

interactWithUser = () => {
  turnOnButtons();
  convertRealTime();
}

turnOnButtons = () => {
  let buttons = document.querySelectorAll('.cur-choise');
  buttons.forEach(but => but.addEventListener('click', (e) => {
    let clickedButton;
    if (e.target.classList.contains('firstSel') || e.target.classList.contains('secondSel')) {
      clickedButton = e.target.parentElement;
    } else { clickedButton = e.target; }

    if (clickedButton.classList.contains('from')) {
      let buttons = document.querySelectorAll('.from');
      buttons.forEach(but => but.classList.remove('chosen'));
      clickedButton.classList.add('chosen');
    } else if (clickedButton.classList.contains('to')) {
      let buttons = document.querySelectorAll('.to');
      buttons.forEach(but => but.classList.remove('chosen'));
      clickedButton.classList.add('chosen');
    }
    convert(e);
  }));
  let change = document.querySelector('.changer');
  change.addEventListener('click', swapAreas);

}

swapAreas = () => {
  let fromCurrencyContainer = document.querySelector('.from.chosen');
  let toCurrencyContainer = document.querySelector('.to.chosen');
  let fromCurrency;
  let toCurrency;
  if (fromCurrencyContainer.children.length>0){
    fromCurrency= document.querySelector('.firstSel.selector').value;
  } else fromCurrency= fromCurrencyContainer.innerText;
  
  if (toCurrencyContainer.children.length>0){
    toCurrency= document.querySelector('.secondSel.selector').value;
  } else toCurrency= toCurrencyContainer.innerText;
  
  handleSwap(fromCurrency, toCurrency);
  loadAreasInfo(toCurrency, fromCurrency);

}

handleSwap = (currFrom, currTo) => {

  document.querySelectorAll('.from').forEach(but => but.classList.remove('chosen'));
  document.querySelectorAll('.to').forEach(but => but.classList.remove('chosen'));

  if (currFrom != 'RUB' && currFrom != 'USD' && currFrom != 'EUR' && currFrom != 'JPY') {
    let options = document.querySelector('.secondSel').children;
    for (let opt of options) {
      if (opt.value == currFrom) {
        opt.selected = true;
        document.querySelector('.secondSel').value = opt.value;
        opt.parentElement.parentElement.classList.add('chosen');
      }
    }
  } else if(currFrom == 'RUB' || currFrom == 'USD' || currFrom == 'EUR' || currFrom == 'JPY')  { 
    document.querySelectorAll('.to').forEach(but => { but.innerHTML == currFrom ? but.classList.add('chosen') : null }) }

  if (currTo != 'RUB' && currTo != 'USD' && currTo != 'EUR' && currTo != 'JPY') {
    let options = document.querySelector('.firstSel').children;
    for (let opt of options)
      if (opt.value == currTo) {
        opt.selected = true;
        document.querySelector('.firstSel').value = opt.value;
        opt.parentElement.parentElement.classList.add('chosen')
      }
  } else if(currTo == 'RUB' || currTo == 'USD' || currTo == 'EUR' || currTo == 'JPY')  { 
    document.querySelectorAll('.from').forEach(but => { but.innerHTML == currTo ? but.classList.add('chosen') : null }) }
}

convertRealTime = () => {
  new Promise((resolve) => {
    let sumFromInput = document.querySelector('.sum-from');
    let sumToInput = document.querySelector('.sum-to');
    sumFromInput.addEventListener('input', convert);
    sumToInput.addEventListener('input', convert);
  });
};

convert = (e) => {
  let event = checkEvent(e.target);
  let currencyFrom = checkCurrencies()[0];
  let currencyTo = checkCurrencies()[1];
  checkFont();

  fetchResult(currencyFrom).then((result) => {
    let rates = result.rates;
    let rateFrom = document.querySelector('.rate-from');
    let rateTo = document.querySelector('.rate-to');
    let sumFromInput = document.querySelector('.sum-from');
    let sumToInput = document.querySelector('.sum-to');
    if (event.classList.contains('sum-from')) {
      sumToInput.value = sumFromInput.value * Number(rates[currencyTo]).toFixed(4);
      rateFrom.innerText = `1 ${currencyFrom} = ${Number(rates[currencyTo]).toFixed(4)} ${currencyTo}`;
      rateTo.innerText = `1 ${currencyTo} = ${Number(1 / rates[currencyTo]).toFixed(4)} ${currencyFrom}`;
    }
    else {
      sumFromInput.value = sumToInput.value / Number(rates[currencyTo]).toFixed(4);
      rateFrom.innerText = `1 ${currencyFrom} = ${Number(rates[currencyTo]).toFixed(4)} ${currencyTo}`;
      rateTo.innerText = `1 ${currencyTo} = ${Number(1 / rates[currencyTo]).toFixed(4)} ${currencyFrom}`;
    }

  })
}

checkFont = () => {
  if (document.querySelector('.sum-from').value.toString().length < 10) {
    document.querySelector('.sum-from').style.fontSize = '36px';
  } else document.querySelector('.sum-from').style.fontSize = '18px';
  if (document.querySelector('.sum-to').value.toString().length < 10) {
    document.querySelector('.sum-to').style.fontSize = '36px';
  } else document.querySelector('.sum-to').style.fontSize = '18px';
}

checkCurrencies = () => {
  if (document.querySelector('.from.chosen').children.length > 0) {
    currencyFrom = document.querySelector('.firstSel.selector').value;
  } else { currencyFrom = document.querySelector('.from.chosen').innerText; }

  if (document.querySelector('.to.chosen').children.length > 0) {
    currencyTo = document.querySelector('.secondSel.selector').value;
  }
  else {
    currencyTo = document.querySelector('.to.chosen').innerText;
  }
  return [currencyFrom, currencyTo];
}

checkEvent = (event) => {
  let resultOfEvent;
  if (event.classList.contains('firstSel') || event.classList.contains('secondSel')) {
    event = event.parentElement;
  }
  if (event.classList.contains('chosen') && event.classList.contains('from')) {
    resultOfEvent = document.querySelector('.sum-from');
  }
  else if (event.classList.contains('chosen') && event.classList.contains('to')) {
    resultOfEvent = document.querySelector('.sum-to');
  }
  else { resultOfEvent = event }
  return resultOfEvent;
}

loadInitInfo();
interactWithUser();