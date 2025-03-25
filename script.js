let balance = 0;
let numberOfLines = 0;
let betAmount = 0;

const ROWS = 3;
const COLS = 3;

const symbols = ["🍒", "🍋", "🍉", "🍇", "🍊", "7️⃣", "💎"];

function deposit() {
  const depositAmount = parseFloat(document.getElementById("deposit").value);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Invalid deposit amount. Try again!");
    return;
  }
  balance += depositAmount;
  updateDisplay();
}

function getNumberOfLines() {
  const lines = parseInt(document.getElementById("lines").value);
  if (isNaN(lines) || lines < 1 || lines > 3) {
    alert("Invalid number of lines. Please enter a value between 1 and 3.");
    return;
  }
  numberOfLines = lines;
  updateDisplay();
}

function placeBet() {
  const bet = parseFloat(document.getElementById("bet").value);
  if (
    isNaN(bet) ||
    bet <= 0 ||
    bet > balance / numberOfLines ||
    numberOfLines === 0
  ) {
    alert("Invalid bet amount. Check balance and number of lines.");
    return;
  }
  betAmount = bet;
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("balance-display").innerText = `Balance: $${balance}`;
  document.getElementById(
    "lines-display"
  ).innerText = `Lines: ${numberOfLines}`;
  document.getElementById("bet-display").innerText = `Bet: $${betAmount}`;
}

function spin() {
  if (betAmount === 0 || numberOfLines === 0) {
    alert("Please set lines and place a bet before spinning.");
    return;
  }

  const totalBet = betAmount * numberOfLines;

  if (balance < totalBet) {
    alert("Insufficient balance to place this bet. Add more balance!");
    return;
  }

  balance -= totalBet;
  updateDisplay();

  const grid = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(getRandomSymbol());
    }
    grid.push(row);
  }

  animateGrid(grid);

  setTimeout(() => {
    displayGrid(grid);
    checkWin(grid);
  }, 2000);
}

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function animateGrid(grid) {
  for (let i = 0; i < ROWS; i++) {
    const rowDiv = document.getElementById(`row${i + 1}`);
    rowDiv.innerHTML = "";
    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML = "🔄";
      rowDiv.appendChild(cell);
    }
  }

  let counter = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = document.getElementById(`row${i + 1}`).children[j];
        cell.innerHTML = getRandomSymbol();
      }
    }
    counter++;
    if (counter > 10) {
      clearInterval(interval);
    }
  }, 100);
}

function displayGrid(grid) {
  for (let i = 0; i < ROWS; i++) {
    const rowDiv = document.getElementById(`row${i + 1}`);
    rowDiv.innerHTML = "";
    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML = grid[i][j];
      if (i < numberOfLines) {
        cell.classList.add("highlight");
      }
      rowDiv.appendChild(cell);
    }
  }
}

function checkWin(grid) {
  let winnings = 0;
  let win = false;

  for (let i = 0; i < numberOfLines; i++) {
    if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
      win = true;
      winnings += betAmount * 5;
    }
  }

  if (win) {
    balance += winnings;
    document.getElementById("result").innerText = `🎉 You won $${winnings}! 🎉`;
  } else {
    document.getElementById("result").innerText = "😢 You lost. Try again!";
  }

  updateDisplay();

  if (balance <= 0) {
    alert("Your balance is empty. Please add more money to continue playing!");
  }
}
