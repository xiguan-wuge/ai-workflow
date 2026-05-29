<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const display = ref('0')
const firstOperand = ref<number | null>(null)
const operator = ref<'+' | '-' | '*' | '/' | null>(null)
const waitingForSecondOperand = ref(false)

const lastOperator = ref<typeof operator.value>(null)
const lastOperand = ref<number | null>(null)
const hasError = ref(false)

const coerceNumber = (value: string) => {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return 'Error'
  // Reduce common floating point noise without pulling in a decimal lib.
  const normalized = Math.abs(value) < 1e-12 ? 0 : value
  const str = Number.isInteger(normalized) ? String(normalized) : String(Number.parseFloat(normalized.toPrecision(12)))
  // Keep display reasonably short; fall back to scientific notation if needed.
  return str.length <= 16 ? str : normalized.toExponential(8)
}

const resetIfError = () => {
  if (!hasError.value) return false
  clear()
  return true
}

const inputDigit = (digit: string) => {
  resetIfError()
  if (waitingForSecondOperand.value) {
    display.value = digit
    waitingForSecondOperand.value = false
  } else {
    display.value = display.value === '0' ? digit : display.value + digit
  }
}

const inputDecimal = () => {
  resetIfError()
  if (waitingForSecondOperand.value) {
    display.value = '0.'
    waitingForSecondOperand.value = false
    return
  }
  if (!display.value.includes('.')) {
    display.value = display.value + '.'
  }
}

const clear = () => {
  display.value = '0'
  firstOperand.value = null
  operator.value = null
  waitingForSecondOperand.value = false
  lastOperator.value = null
  lastOperand.value = null
  hasError.value = false
}

const backspace = () => {
  resetIfError()
  if (waitingForSecondOperand.value) {
    // If the user changes their mind right after selecting an operator, treat it
    // like clearing the pending second operand.
    display.value = '0'
    waitingForSecondOperand.value = false
    return
  }

  if (display.value.length <= 1 || (display.value.length === 2 && display.value.startsWith('-'))) {
    display.value = '0'
    return
  }
  display.value = display.value.slice(0, -1)
}

const toggleSign = () => {
  resetIfError()
  if (waitingForSecondOperand.value) {
    display.value = '0'
    waitingForSecondOperand.value = false
  }
  if (display.value === '0') return
  display.value = display.value.startsWith('-') ? display.value.slice(1) : `-${display.value}`
}

const percent = () => {
  resetIfError()
  const current = coerceNumber(display.value)
  if (firstOperand.value !== null && operator.value && !waitingForSecondOperand.value && (operator.value === '+' || operator.value === '-')) {
    display.value = formatNumber(firstOperand.value * (current / 100))
  } else {
    display.value = formatNumber(current / 100)
  }
}

const performOperation = (nextOperator: typeof operator.value) => {
  if (resetIfError()) return
  const inputValue = coerceNumber(display.value)

  if (operator.value && !waitingForSecondOperand.value) {
    const result = calculate()
    if (result === null) return
    display.value = formatNumber(result)
    firstOperand.value = result
  } else {
    firstOperand.value = inputValue
  }

  operator.value = nextOperator
  waitingForSecondOperand.value = true
  lastOperator.value = null
  lastOperand.value = null
}

const calculate = (): number | null => {
  const secondOperand = coerceNumber(display.value)
  const a = firstOperand.value ?? 0

  switch (operator.value) {
    case '+':
      return a + secondOperand
    case '-':
      return a - secondOperand
    case '*':
      return a * secondOperand
    case '/':
      if (secondOperand === 0) {
        display.value = 'Error'
        hasError.value = true
        operator.value = null
        firstOperand.value = null
        waitingForSecondOperand.value = false
        return null
      }
      return a / secondOperand
    default:
      return secondOperand
  }
}

const equals = () => {
  if (resetIfError()) return

  // If there's no pending operator, repeat the last "=" operation if possible.
  if (!operator.value) {
    if (!lastOperator.value || lastOperand.value === null) return
    firstOperand.value = coerceNumber(display.value)
    operator.value = lastOperator.value
    display.value = formatNumber(lastOperand.value)
  }

  if (!operator.value || firstOperand.value === null) return
  if (waitingForSecondOperand.value) {
    // Treat "2 + =" as "2 + 2"
    display.value = formatNumber(firstOperand.value)
    waitingForSecondOperand.value = false
  }

  const result = calculate()
  if (result === null) return
  lastOperator.value = operator.value
  lastOperand.value = coerceNumber(display.value)
  display.value = formatNumber(result)
  operator.value = null
  firstOperand.value = null
  waitingForSecondOperand.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  // Avoid hijacking typing in inputs.
  const target = e.target as HTMLElement | null
  const tag = target?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable) return

  const { key } = e
  if (key >= '0' && key <= '9') {
    e.preventDefault()
    inputDigit(key)
    return
  }
  if (key === '.') {
    e.preventDefault()
    inputDecimal()
    return
  }
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    e.preventDefault()
    performOperation(key)
    return
  }
  if (key === 'Enter' || key === '=') {
    e.preventDefault()
    equals()
    return
  }
  if (key === 'Backspace') {
    e.preventDefault()
    backspace()
    return
  }
  if (key === 'Escape') {
    e.preventDefault()
    clear()
    return
  }
  if (key === '%') {
    e.preventDefault()
    percent()
    return
  }
  if (key === 'F9') {
    e.preventDefault()
    toggleSign()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="calculator" aria-label="Calculator">
    <div class="display" role="status" aria-live="polite" aria-atomic="true">
      {{ display }}
    </div>
    <div class="buttons">
      <button type="button" class="operator" aria-label="Clear" @click="clear">C</button>
      <button type="button" aria-label="Backspace" @click="backspace">⌫</button>
      <button type="button" aria-label="Percent" @click="percent">%</button>
      <button type="button" class="operator" aria-label="Divide" @click="performOperation('/')">/</button>

      <button type="button" @click="inputDigit('7')">7</button>
      <button type="button" @click="inputDigit('8')">8</button>
      <button type="button" @click="inputDigit('9')">9</button>
      <button type="button" class="operator" aria-label="Multiply" @click="performOperation('*')">*</button>

      <button type="button" @click="inputDigit('4')">4</button>
      <button type="button" @click="inputDigit('5')">5</button>
      <button type="button" @click="inputDigit('6')">6</button>
      <button type="button" class="operator" aria-label="Subtract" @click="performOperation('-')">-</button>

      <button type="button" @click="inputDigit('1')">1</button>
      <button type="button" @click="inputDigit('2')">2</button>
      <button type="button" @click="inputDigit('3')">3</button>
      <button type="button" class="operator" aria-label="Add" @click="performOperation('+')">+</button>

      <button type="button" aria-label="Toggle sign" @click="toggleSign">±</button>
      <button type="button" @click="inputDigit('0')">0</button>
      <button type="button" aria-label="Decimal point" @click="inputDecimal">.</button>
      <button type="button" class="equals" aria-label="Equals" @click="equals">=</button>
    </div>
  </div>
</template>

<style scoped>
.calculator {
  width: min(340px, 100%);
  padding: 20px;
  border-radius: 12px;
  background: #f5f5f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
}

.display {
  width: 100%;
  height: 50px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  font-size: 28px;
  font-weight: bold;
  box-sizing: border-box;
  margin-bottom: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

button {
  height: 50px;
  font-size: 20px;
  border: none;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  background: #e8e8e8;
}

button:active {
  background: #d0d0d0;
  transform: scale(0.98);
}

button:focus-visible {
  outline: 3px solid rgba(0, 0, 0, 0.25);
  outline-offset: 2px;
}

.operator {
  background: #ff9500;
  color: white;
}

.operator:hover {
  background: #e68600;
}

.equals {
  background: #34c759;
  color: white;
}

.equals:hover {
  background: #2db04d;
}
</style>
