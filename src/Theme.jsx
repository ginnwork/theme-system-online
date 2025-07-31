/* @refresh reload */
/* eslint-env browser */
import { createContext, For, Index, useContext } from 'solid-js'

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
  const [, { addDay, addTask, removeDay, removeTheme, updateLabel, updateTheme }] = useApp()

  /**
   * @param {number} index The index of the day in the theme's days array.
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
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputTitle = (event) => {
    updateTheme(props.index, 'title', event.currentTarget.value)
  }

  /**
   * @param {number} day The index of the day in the theme's days array.
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputLabel = (day, event) => {
    updateLabel(props.index, day, event.currentTarget.value)
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
        class='m-4 p-4 border border-gray-400 grid gap-3 --border-'
        style={{
          'grid-template-columns': `minmax(50%,1fr) repeat(${props.days.length + 1}, max-content)`
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
            <div class='border border-gray-400'>
              <div class='bg-gray-200 text-center'>{letter(index)}</div>
              <input
                class='text-center w-8'
                type='text'
                value={day()}
                onInput={[onInputLabel, index]}
              />
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
              class='border border-gray-400 cursor-pointer hover:bg-black/11 transition duration-300 text-center'
              onClick={[onRemoveDay, index]}
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
