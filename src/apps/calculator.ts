import type { CalculatorOperator, GameState } from "../game/gameState";

const history = [
  ["2 + 3", "10"],
  ["3 + 4", "21"],
  ["4 + 5", "36"],
  ["5 + 6", "?"],
];

export function renderCalculatorScreen(
  state: GameState,
  notice: string,
): string {
  if (state.calculatorView === "success") return renderCalculatorSuccess();
  if (state.calculatorView === "history") return renderHistory(state, notice);
  return renderCalculator(state);
}

function renderCalculator(state: GameState): string {
  const resolved = state.completedApps.includes(3);
  return `<section class="calculator-app" data-calculator-view="calculator">
    <header class="calculator-toolbar">
      <button class="calculator-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Utility</p><h1>Calculator</h1></div>
      <span class="calculator-toolbar-end"><button class="history-button" data-action="calculator-history">History</button>${resolved ? '<span class="calculator-resolved">Resolved</span>' : ""}</span>
    </header>
    <div class="calculator-display" aria-live="polite"><span class="display-label">Current input</span><strong>${state.calculatorDisplay}</strong></div>
    <div class="calculator-keypad" aria-label="Calculator keypad">
      <button class="calc-key utility-key" data-calc="clear">C</button><button class="calc-key utility-key" data-calc="toggle-sign">+/-</button><button class="calc-key utility-key" data-calc="percent">%</button><button class="calc-key operator-key" data-calc="÷">÷</button>
      <button class="calc-key" data-calc="7">7</button><button class="calc-key" data-calc="8">8</button><button class="calc-key" data-calc="9">9</button><button class="calc-key operator-key" data-calc="×">×</button>
      <button class="calc-key" data-calc="4">4</button><button class="calc-key" data-calc="5">5</button><button class="calc-key" data-calc="6">6</button><button class="calc-key operator-key" data-calc="-">−</button>
      <button class="calc-key" data-calc="1">1</button><button class="calc-key" data-calc="2">2</button><button class="calc-key" data-calc="3">3</button><button class="calc-key operator-key" data-calc="+">+</button>
      <button class="calc-key zero-key" data-calc="0">0</button><button class="calc-key" data-calc=".">.</button><button class="calc-key equals-key" data-calc="=">=</button>
    </div>
    <p class="calculator-footer">Offline utility · no recent activity</p>
  </section>`;
}

function renderHistory(state: GameState, notice: string): string {
  return `<section class="calculator-app calculator-history" data-calculator-view="history">
    <header class="calculator-toolbar history-toolbar">
      <button class="calculator-nav" data-action="calculator-main" aria-label="Back to calculator">‹</button>
      <div><p class="eyebrow">Calculator</p><h1>History</h1></div>
      <span class="history-count">04</span>
    </header>
    <div class="calculation-list">
      ${history.map(([expression, result], index) => `<div class="calculation-row"><span class="calculation-index">0${index + 1}</span><span>${expression}</span><strong>${result}</strong></div>`).join("")}
    </div>
    <div class="calculator-puzzle-panel">
      <p class="calculator-prompt">Enter the missing result</p>
      <form data-action="solve-calculator" class="calculator-answer-form">
        <label for="calculator-answer">Missing result</label>
        <div class="answer-row"><input id="calculator-answer" name="answer" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="_ _" aria-label="Enter the missing result" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="calculator-hint">${state.calculatorHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.calculatorHintLevel > 0 ? `<p class="calculator-hint">${state.calculatorHintLevel > 1 ? "Look at how the first number interacts with the two numbers." : "The plus sign may not mean addition."}</p>` : ""}
    </div>
  </section>`;
}

function renderCalculatorSuccess(): string {
  return `<section class="calculator-app calculator-success" data-calculator-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Calculator · recovered</p>
    <h1>CALCULATION RECOVERED</h1>
    <strong class="recovered-result">55</strong>
    <div class="clue-fragments"><span>A</span><i>—</i><span>17</span><i>—</i><span>55</span></div>
    <p class="calculator-question">Why do these numbers keep appearing?</p>
    <p class="calculator-signature">— A</p>
    <button class="primary-button success-button" data-action="dismiss-calculator-success">Return to home</button>
  </section>`;
}

export function applyCalculatorInput(state: GameState, input: string): void {
  if (input === "clear") {
    state.calculatorDisplay = "0";
    state.calculatorStoredValue = null;
    state.calculatorOperator = null;
    state.calculatorWaitingForOperand = false;
    return;
  }
  if (input === "toggle-sign") {
    state.calculatorDisplay = String(Number(state.calculatorDisplay) * -1);
    return;
  }
  if (input === "percent") {
    state.calculatorDisplay = String(Number(state.calculatorDisplay) / 100);
    return;
  }
  if (input === "." || /^\d$/.test(input)) {
    if (state.calculatorWaitingForOperand) {
      state.calculatorDisplay = input === "." ? "0." : input;
      state.calculatorWaitingForOperand = false;
    } else if (input === "." && state.calculatorDisplay.includes(".")) {
      return;
    } else {
      state.calculatorDisplay =
        state.calculatorDisplay === "0" && input !== "."
          ? input
          : state.calculatorDisplay + input;
    }
    return;
  }
  if (input === "=") {
    if (state.calculatorStoredValue !== null && state.calculatorOperator) {
      state.calculatorDisplay = formatResult(
        calculate(
          state.calculatorStoredValue,
          Number(state.calculatorDisplay),
          state.calculatorOperator,
        ),
      );
      state.calculatorStoredValue = null;
      state.calculatorOperator = null;
      state.calculatorWaitingForOperand = true;
    }
    return;
  }
  const operator = input as CalculatorOperator;
  if (
    state.calculatorStoredValue !== null &&
    state.calculatorOperator &&
    !state.calculatorWaitingForOperand
  ) {
    state.calculatorDisplay = formatResult(
      calculate(
        state.calculatorStoredValue,
        Number(state.calculatorDisplay),
        state.calculatorOperator,
      ),
    );
  }
  state.calculatorStoredValue = Number(state.calculatorDisplay);
  state.calculatorOperator = operator;
  state.calculatorWaitingForOperand = true;
}

function calculate(
  first: number,
  second: number,
  operator: CalculatorOperator,
): number {
  if (operator === "+") return first + second;
  if (operator === "-") return first - second;
  if (operator === "×") return first * second;
  return second === 0 ? 0 : first / second;
}

function formatResult(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : String(Number(value.toFixed(8)));
}
