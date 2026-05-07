<script setup lang="ts">
import { ref } from 'vue'

const display = ref('0')
const firstOperand = ref<number | null>(null)
const operator = ref<string | null>(null)
const waitingForSecondOperand = ref(false)

const inputDigit = (digit: string) => {
  if (waitingForSecondOperand.value) {
    display.value = digit
    waitingForSecondOperand.value = false
  } else {
    display.value = display.value === '0' ? digit : display.value + digit
  }
}

const inputDecimal = () => {
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
}

const performOperation = (nextOperator: string) => {
  const inputValue = parseFloat(display.value)

  if (operator.value && !waitingForSecondOperand.value) {
    const result = calculate()
    display.value = String(result)
    firstOperand.value = result
  } else {
    firstOperand.value = inputValue
  }

  operator.value = nextOperator
  waitingForSecondOperand.value = true
}

const calculate = (): number => {
  const secondOperand = parseFloat(display.value)
  let result: number

  switch (operator.value) {
    case '+':
      result = firstOperand.value! + secondOperand
      break
    case '-':
      result = firstOperand.value! - secondOperand
      break
    case '*':
      result = firstOperand.value! * secondOperand
      break
    case '/':
      result = secondOperand !== 0 ? firstOperand.value! / secondOperand : 0
      break
    default:
      return secondOperand
  }

  return result
}

const equals = () => {
  if (!operator.value || firstOperand.value === null) return

  const result = calculate()
  display.value = String(result)
  operator.value = null
  firstOperand.value = null
  waitingForSecondOperand.value = false
}
</script>

<template>
  <div class="calculator">
    <div class="display">{{ display }}</div>
    <div class="buttons">
      <button class="operator" @click="clear">C</button>
      <button @click="inputDigit('7')">7</button>
      <button @click="inputDigit('8')">8</button>
      <button @click="inputDigit('9')">9</button>
      <button class="operator" @click="performOperation('/')">/</button>
      <button @click="inputDigit('4')">4</button>
      <button @click="inputDigit('5')">5</button>
      <button @click="inputDigit('6')">6</button>
      <button class="operator" @click="performOperation('*')">*</button>
      <button @click="inputDigit('1')">1</button>
      <button @click="inputDigit('2')">2</button>
      <button @click="inputDigit('3')">3</button>
      <button class="operator" @click="performOperation('-')">-</button>
      <button @click="inputDecimal">.</button>
      <button @click="inputDigit('0')">0</button>
      <button class="equals" @click="equals">=</button>
      <button class="operator" @click="performOperation('+')">+</button>
    </div>
  </div>
</template>

<style scoped>
.calculator {
  width: 280px;
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