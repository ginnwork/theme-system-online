/* @refresh reload */
/* eslint-env browser */
import { createContext, For, Index, Show, useContext } from 'solid-js'

import Task from './Task.jsx'
import { useApp } from './App.jsx'

/**
 * @import { JSXElement } from 'solid-js'
 */

/**
 * @import { AppTheme } from './App.jsx'
 */

/**
 * @typedef {Object} ThemeProps
 * @property {number} index The index of the theme in the themes array.
 */

const ThemeContext = createContext()

/**
 * @param {AppTheme & ThemeProps} props
 * @returns {JSXElement}
 */
export default function Theme (props) {
  const [app, {
    addDay,
    addTask,
    hoverDay,
    hoverReset,
    removeDay,
    removeTheme,
    updateLabel,
    updateTheme
  }] = useApp()

  /**
   * @param {number} index The index of the day in the theme's days array.
   * @returns {string}
   */
  const bg = (index) => app.theme === props.index && app.day === index
    ? 'bg-blue-100'
    : 'bg-gray-200'

  /**
   * @param {number} index The index of the day in the theme's days array.
   * @returns {string}
   */
  const color = (index) => app.theme === props.index && app.day === index
    ? 'border-blue-500 text-blue-500'
    : 'border-gray-400'

  /**
   * @param {number} index The index of the day in the theme's days array.
   * @returns {string}
   */
  const digit = (index) => {
    if (!props.date) return ''
    const date = new Date(props.date)
    if (index) date.setDate(date.getDate() + index)
    return date.getDate().toString()
  }

  /**
   * @param {number} index Offset to get the letter for the day of the week.
   * @returns {string}
   */
  const letter = (index) => {
    if (!props.date) return ''
    const date = new Date(props.date)
    if (index) date.setDate(date.getDate() + index)
    return date.toLocaleDateString('en-us', { weekday: 'narrow' })
  }

  /**
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputDate = (event) => {
    const value = event.currentTarget.value
    const date = value ? new Date(value) : null
    updateTheme(props.index, 'date', date)
  }

  /**
   * @param {number} day The index of the day in the theme's days array.
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputLabel = (day, event) => {
    const value = event.currentTarget.value
    const prop = props.days[day].split('\n')[1] ?? ''
    updateLabel(props.index, day, value + '\n' + prop)
  }

  /**
   * @param {number} day The index of the day in the theme's days array.
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputDigit = (day, event) => {
    const value = event.currentTarget.value
    const prop = props.days[day].split('\n')[0] ?? ''
    updateLabel(props.index, day, prop + '\n' + value)
  }

  /**
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputTitle = (event) => {
    updateTheme(props.index, 'title', event.currentTarget.value)
  }

  /**
   * @param {number} index The index of the day in the theme's days array.
   * @returns {void}
   */
  const onOverDay = (index) => {
    hoverDay(props.index, -1, index)
  }

  /**
   * @param {number} day The index of the day in the theme's days array.
   * @returns {void}
   */
  const onRemoveDay = (day) => {
    removeDay(props.index, day)
  }

  return (
    <ThemeContext.Provider value={[props]}>
      <div
        class='m-4 p-4 border border-gray-400 grid gap-3'
        style={{
          'grid-template-columns': `1fr repeat(${props.days.length + 1}, max-content)`
        }}
      >
        <div class='relative'>
          <textarea
            class='w-full h-full px-2'
            type='text'
            onInput={onInputTitle}
          >
            {props.title}
          </textarea>

          <input
            class='absolute bottom-0 right-0 bg-white text-gray-400'
            type='date'
            value={props.date?.toLocaleDateString() ?? ''}
            onInput={onInputDate}
          />
        </div>

        <Index each={props.days}>
          {(day, index) => (
            <div
              class={`border ${color(index)}`}
              onPointerOver={[onOverDay, index]}
              onPointerOut={hoverReset}
            >
              <Show
                when={props.date}
                fallback={(
                  <>
                    <input
                      class={`text-center w-8 ${bg(index)}`}
                      type='text'
                      value={day().split('\n')[0] ?? ''}
                      onInput={[onInputLabel, index]}
                    />

                    <br />

                    <input
                      class='text-center w-8'
                      type='text'
                      value={day().split('\n')[1] ?? ''}
                      onInput={[onInputDigit, index]}
                    />
                  </>
                )}
              >
                <div class={`text-center ${bg(index)}`}>
                  {letter(index)}
                </div>

                <div class='text-center w-8'>
                  {digit(index)}
                </div>
              </Show>
            </div>
          )}
        </Index>

        <button
          class='text-center border border-gray-400 w-8 h-full cursor-pointer hover:bg-black/11 transition duration-300'
          onClick={[addDay, props.index]}
        >
          +
        </button>

        <For each={props.tasks}>
          {(task, index) => (
            <Task index={index()} {...task} />
          )}
        </For>

        <button
          class='border border-gray-400 h-8 hover:bg-black/11 transition duration-300 cursor-pointer text-center'
          onClick={[addTask, props.index]}
        >
          +
        </button>

        <Index each={props.days}>
          {(_, index) => (
            <button
              class={`border cursor-pointer text-center ${color(index)}`}
              onClick={[onRemoveDay, index]}
              onPointerOver={[onOverDay, index]}
              onPointerOut={hoverReset}
            >
              -
            </button>
          )}
        </Index>

        <button
          class='border border-gray-400 h-8 hover:bg-black/11 transition duration-300 cursor-pointer text-center'
          onClick={[removeTheme, props.index]}
        >
          x
        </button>
      </div>
    </ThemeContext.Provider>
  )
}

/**
 * @returns {[AppTheme & ThemeProps]}
 */
export function useTheme () {
  return useContext(ThemeContext)
}
