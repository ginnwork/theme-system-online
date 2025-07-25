import { useApp } from './App.jsx'
import { useTask } from './Task.jsx'
import { useTheme } from './Theme.jsx'

/**
 * @import { JSXElement } from 'solid-js'
 */

/**
 * @typedef {Object} DotProps
 * @property {number} index The index of the day in the task's days array.
 * @property {DotStatus} status The fill state of the dot (0: blank, 1: upper, 2: lower, 3: checked).
 */

/**
 * @typedef {typeof STATUS_BLANK|typeof STATUS_UPPER|typeof STATUS_LOWER|typeof STATUS_CHECKED} DotStatus
 */

export const STATUS_BLANK = 0
export const STATUS_LOWER = 1
export const STATUS_UPPER = 2
export const STATUS_CHECKED = 3

/**
 * @param {number} fill The current fill state of the dot.
 * @returns {number}
 */
export function nextFill (fill) {
  return fill + 1 > STATUS_CHECKED ? STATUS_BLANK : fill + 1
}

/**
 * @param {DotProps} props
 * @returns {JSXElement}
 */
export default function Dot (props) {
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
