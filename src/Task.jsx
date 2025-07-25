import { createContext, For, useContext } from 'solid-js'

import Dot from './Dot.jsx'
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
  const [, { removeTask, updateTask }] = useApp()
  const [theme] = useTheme()

  /**
   * @returns {Array<string>}
   */
  const days = () => theme.days.length < props.days.length
    ? props.days.slice(0, theme.days.length)
    : props.days.concat(new Array(theme.days.length - props.days.length).fill(0))

  /**
   * @param {InputEvent & { currentTarget: HTMLInputElement }} event The input event for the update.
   */
  const onInputTitle = (event) => {
    updateTask(theme.index, props.index, 'title', event.currentTarget.value)
  }

  const onRemoveTask = () => {
    removeTask(theme.index, props.index)
  }

  return (
    <TaskContext.Provider value={[props]}>
      <input class='border border-black/33 px-2' value={props.title} onInput={onInputTitle} />

      <For each={days()}>
        {(status, index) => (
          <Dot index={index()} status={status} />
        )}
      </For>

      <button
        class='border border-black/33 cursor-pointer text-center hover:bg-black/11 transition duration-300'
        onClick={onRemoveTask}
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
