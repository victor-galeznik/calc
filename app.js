const calculator = document.querySelector('.calculator');
const calculatorClearBlock = document.querySelector('#calculator-clear');
let allHistory = [];
let history = [];
let tempNumber = '';
let operationType = '';
let isPercent = false;
let isEqual = false;

calculator.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('calculator__col')) {
    const data = target.dataset.type;
    const totalBLock = calculator.querySelector('.calculator__total');
    const historyBlock = calculator.querySelector('.calculator__history');
    operationTypeHandling(data);
    totalBLock.innerHTML = tempNumber;
    historyBlock.innerHTML = renderHistory(history);
    historyPanelRender(allHistory);
  }
});

// history.push(value);
function operationTypeHandling(data) {
  if (data !== 'clear' && data !== 'history') {
    calculatorClearBlock.innerText = 'C';
  }

  if (data >= 0) {
    operationType = 'number';
    tempNumber = tempNumber === '0' ? data : tempNumber + data;
  } else if (data === 'float') {
    operationType = 'number';
    if (!/\./.test(tempNumber)) {
      if (tempNumber) {
        tempNumber = tempNumber + '.';
      } else {
        tempNumber = '0.';
      }
    }
  } else if (data === 'delete' && operationType === 'number') {
    tempNumber = tempNumber.substring(0, tempNumber.length - 1);
    tempNumber = tempNumber ? tempNumber : '0';
    isPercent = false;
  } else if (['+', '-', '/', '*'].includes(data) && tempNumber) {
    operationType = data;
    history.push(tempNumber, operationType);
    tempNumber = '';
    isPercent = false;
    calculatorClearBlock.innerText = 'C';
  } else if (data === 'clear') {
    history = [];
    tempNumber = '0';
    isPercent = false;
    if (calculatorClearBlock.innerText === 'C') {
      calculatorClearBlock.innerText = 'CA';
    } else {
      calculatorClearBlock.innerText = 'C';
      allHistory = [];
    }
  } else if (data === 'history') {
    openHistoryPanel();
  } else if (data === '%') {
    history.push(tempNumber);
    isPercent = true;
    isEqual = false;
    tempNumber = calculate(history, isPercent, isEqual);
  } else if (data === '=') {
    const historySegment = [];
    if (!isPercent) {
      history.push(tempNumber);
    }
    historySegment.push(history);
    isEqual = true;
    tempNumber = calculate(history, isPercent, isEqual);
    historySegment.push(tempNumber);
    allHistory.push(historySegment);
    history = [];
    isPercent = false;
  }
}

// function renderTotal(elem, value) {
//   elem.innerText = value;
// }

function renderHistory(historyArray) {
  let htmlElements = '';

  historyArray.forEach((item) => {
    if (item >= 0) {
      htmlElements = htmlElements + ` <span>${item}</span>`;
    } else if (['+', '-', '/', '*', '%'].includes(item)) {
      item = item === '*' ? '×' : item === '/' ? '÷' : item;
      htmlElements = htmlElements + ` <strong>${item}</strong>`;
    }
  });
  // console.log(htmlElements);
  return htmlElements;
}

function historyPanelRender(allHistory) {
  const historyContent = document.querySelector('#history-content');
  let historyPanelHtml = '';
  allHistory.forEach((item) => {
    const html = `
      <div>
        <div class="calculator__history">
          ${renderHistory(item[0])}
        </div>
        <div class="calculator__total">${item[1]}</div>
      </div>
    `;
    historyPanelHtml = historyPanelHtml + html;
  });
  historyContent.innerHTML = historyPanelHtml;
}

function calculate(historyArray, isPercent, isEqual) {
  let total = 0;
  historyArray.forEach((item, idx) => {
    item = parseFloat(item);
    if (idx === 0) {
      total = item;
    } else if (
      idx - 2 >= 0 &&
      isPercent &&
      idx - 2 === historyArray.length - 3
    ) {
      const x = total;
      const operation = historyArray[idx - 1];
      const n = item;
      if (!isEqual) {
        total = calculatePercent(x, operation, n);
      } else {
        total = calculatePercentWhenPushEqual(x, operation, n);
      }
    } else if (idx - 2 >= 0) {
      const prevItem = historyArray[idx - 1];
      if (item >= 0) {
        if (prevItem === '+') {
          total = total + item;
        } else if (prevItem === '-') {
          total = total - item;
        } else if (prevItem === '/') {
          total = total / item;
        } else if (prevItem === '*') {
          total = total * item;
        } else if (prevItem === '%') {
          total = (total / 100) * item;
        }
      }
    }
  });
  return String(total);
}

function calculatePercent(x, operation, n) {
  let total;
  if (['+', '-'].includes(operation)) {
    total = x * (n / 100);
  } else if (['*', '/'].includes(operation)) {
    total = n / 100;
  }
  return total;
}

function calculatePercentWhenPushEqual(x, operation, n) {
  console.log(x, operation, n);
  let total = 0;
  if (operation === '+') {
    total = x + (n / 100) * x;
  } else if (operation === '-') {
    total = x - (n / 100) * x;
  } else if (operation === '*') {
    total = x * (n / 100);
  } else if (operation === '/') {
    total = x / (n / 100);
  }
  return total;
}

///////

const theme = document.querySelector('.theme');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');

theme.onclick = () => {
  theme.classList.toggle('theme_dark');
  calculator.classList.toggle('calculator_dark');
  sun.classList.toggle('display-none');
  moon.classList.toggle('display-none');
};

/////
const historyPanel = document.querySelector('#history-panel');
const closeHistoryBtn = historyPanel.querySelector('#close');

closeHistoryBtn.onclick = () => {
  historyPanel.classList.remove('open');
};

function openHistoryPanel() {
  historyPanel.classList.add('open');
}
