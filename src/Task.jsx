import { createContext, For, useContext } from 'solid-js'

import Day from './Day.jsx'
import { useApp } from './App.jsx'
import { useTheme } from './Theme.jsx'

/**
 * @import { ThemeTask } from './App.jsx'
 */

/**
 * @typedef {Object} TaskProps
 * @property {number} index The index of the task in the tasks array.
 */

const TaskContext = createContext()

/**
 * @param {TaskProps & ThemeTask} props
 * @returns {JSXElement}
 */
export default function Task (props) {
  const [app, { hoverDay, hoverReset, removeTask, updateTask }] = useApp()
  const [theme] = useTheme()

  /**
   * @returns {Array<string>}
   */
  const days = () => theme.days.length < props.days.length
    ? props.days.slice(0, theme.days.length)
    : props.days.concat(new Array(theme.days.length - props.days.length).fill(0))

  /**
   * @returns {string}
   */
  const style = () => app.theme === theme.index && app.task === props.index
    ? 'text-blue-500 border-blue-500'
    : 'border-gray-500'

  /**
   * @returns {void}
   */
  const onOverTask = () => {
    hoverDay(theme.index, props.index, -1)
  }

  /**
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   * @returns {void}
   */
  const onInputTitle = (event) => {
    updateTask(theme.index, props.index, 'title', event.currentTarget.value)
  }

  /**
   * @returns {void}
   */
  const onRemoveTask = () => {
    removeTask(theme.index, props.index)
  }

  return (
    <TaskContext.Provider value={[props]}>
      <input
        class={`border px-2 ${style()}`}
        value={props.title}
        onInput={onInputTitle}
        onPointerOver={onOverTask}
        onPointerOut={hoverReset}
      />

      <For each={days()}>
        {(status, index) => (
          <Day index={index()} status={status} />
        )}
      </For>

      <button
        class={`border cursor-pointer text-center ${style()}`}
        onClick={onRemoveTask}
        onPointerOver={onOverTask}
        onPointerOut={hoverReset}
      >
        -
      </button>
    </TaskContext.Provider>
  )
}

/**
 * @returns {[TaskProps & ThemeTask]}
 */
export function useTask () {
  return useContext(TaskContext)
}
