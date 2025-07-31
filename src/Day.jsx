import { useApp } from './App.jsx'
import { useTask } from './Task.jsx'
import { useTheme } from './Theme.jsx'

/**
 * @import { JSXElement } from 'solid-js'
 */

/**
 * @typedef {Object} DayProps
 * @property {number} index The index of the day in the task's days array.
 * @property {DayStatus} status The fill state of the day (0: blank, 1: upper, 2: lower, 3: checked).
 */

/**
 * @typedef {typeof STATUS_BLANK|typeof STATUS_UPPER|typeof STATUS_LOWER|typeof STATUS_CHECKED} DayStatus
 */

export const STATUS_BLANK = 0
export const STATUS_LOWER = 1
export const STATUS_UPPER = 2
export const STATUS_CHECKED = 3

/**
 * @param {number} status The current status of the day.
 * @returns {number}
 */
export function nextStatus (status) {
  return status + 1 > STATUS_CHECKED ? STATUS_BLANK : status + 1
}

/**
 * @param {DayProps} props
 * @returns {JSXElement}
 */
export default function Day (props) {
  const [, { updateDay }] = useApp()
  const [theme] = useTheme()
  const [task] = useTask()

  /**
   * @returns {string}
   */
  const top = () => props.status === STATUS_UPPER || props.status === STATUS_CHECKED ? 'bg-black' : ''

  /**
   * @returns {string}
   */
  const bottom = () => props.status === STATUS_LOWER || props.status === STATUS_CHECKED ? 'bg-black' : ''

  const onClickDay = () => {
    updateDay(theme.index, task.index, props.index)
  }

  return (
    <div class='rotate-135 w-8 h-8 cursor-pointer' onClick={onClickDay}>
      <div class={`w-full h-1/2 border border-b-transparent border-black/66 rounded-t-full ${top()}`} />
      <div class='w-full border-b border-black/33 -my-px' />
      <div class={`w-full h-1/2 border border-t-transparent border-black/66 rounded-b-full ${bottom()}`} />
    </div>
  )
}
