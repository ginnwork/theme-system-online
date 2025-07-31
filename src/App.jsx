import { createContext, createEffect, For, useContext } from 'solid-js'

import demo from './demo.json'
import Theme from './Theme.jsx'
import { nextStatus } from './Day.jsx'
import { createStoreProducer } from './utils.jsx'
import { loadThemes, parseThemes, saveThemes } from './data.jsx'

/**
 * @import { JSXElement } from 'solid-js'
 */

/**
 * @typedef {(theme: number) => void} AddDay
 */

/**
 * @typedef {(theme: number) => void} AddTask
 */

/**
 * @typedef {() => void} AddTheme
 */

/**
 * @typedef {Object} AppContextActions
 * @property {AddDay} addDay Function to add a new day to a theme.
 * @property {AddTask} addTask Function to add a new task to a theme.
 * @property {AddTheme} addTheme Function to add a new theme.
 * @property {HoverDay} hoverDay Function to set the current hovered day in the app state.
 * @property {HoverReset} hoverReset Function to reset the hovered day in the app state.
 * @property {RemoveDay} removeDay Function to remove a day from a theme.
 * @property {RemoveTask} removeTask Function to remove a task from a theme.
 * @property {RemoveTheme} removeTheme Function to remove a theme.
 * @property {UpdateDay} updateDay Function to update the status of a specific day in a task.
 * @property {UpdateLabel} updateLabel Function to update the label of a specific day in a theme.
 * @property {UpdateTask} updateTask Function to update a task's attribute (title or date).
 * @property {UpdateTheme} updateTheme Function to update a theme's attribute (title or date).
 */

/**
 * @typedef {Object} AppContextState
 * @property {number} day The index of the currently hovered day.
 * @property {boolean} demo Toggle to show demo data.
 * @property {number} task The index of the currently hovered task.
 * @property {number} theme The index of the currently hovered theme.
 */

/**
 * @typedef {Object} AppTheme
 * @property {string} title The title of the theme.
 * @property {Date} [date] The date of the theme in ISO format.
 * @property {Array<string>} days An array of labels for the days of the week.
 * @property {Array<ThemeTask>} tasks An array of tasks associated with the theme.
 */

/**
 * @typedef {(theme: number, task: number, day: number) => void} HoverDay
 */

/**
 * @typedef {() => void} HoverReset
 */

/**
 * @typedef {(theme: number, day: number) => void} RemoveDay
 */

/**
 * @typedef {(theme: number, task: number) => void} RemoveTask
 */

/**
 * @typedef {(theme: number) => void} RemoveTheme
 */

/**
 * @typedef {Object} ThemeTask
 * @property {string} title The title of the task.
 * @property {Array<number>} days An array representing the status of each day (0: unchecked, 1: upper, 2: lower, 3: checked).
 */

/**
 * @typedef {() => void} ToggleDemo
 */

/**
 * @typedef {(theme: number, task: number, day: number) => void} UpdateDay
 */

/**
 * @typedef {(theme: number, day: number, value: string) => void} UpdateLabel
 */

/**
 * @typedef {(theme: number, task: number, attr: 'title'|'date', value: any) => void} UpdateTask
 */

/**
 * @typedef {(theme: number, attr: 'title'|'date', value: any) => void} UpdateTheme
 */

const AppContext = createContext()

/**
 * @returns {JSXElement}
 */
export default function App () {
  const [app, setApp] = createStoreProducer({
    day: -1,
    demo: false,
    task: -1,
    theme: -1
  })
  const [themes, setThemes] = createStoreProducer(loadThemes())

  /** @type {AddDay} */
  const addDay = (theme) => {
    setThemes((themes) => {
      themes[theme].days.push('')
      themes[theme].tasks.forEach(task => task.days.push(0))
    })
  }

  /** @type {AddTask} */
  const addTask = (theme) => {
    setThemes((themes) => {
      themes[theme].tasks.push({
        title: '',
        days: Array(themes[theme].days.length).fill(0)
      })
    })
  }

  /** @type {AddTheme} */
  const addTheme = () => {
    setThemes((themes) => {
      themes.push({
        title: '',
        date: null,
        days: Array(7).fill(''),
        tasks: []
      })
    })
  }

  /** @type {HoverDay} */
  const hoverDay = (theme, task, day) => {
    setApp((app) => {
      app.theme = theme
      app.task = task
      app.day = day
    })
  }

  /** @type {HoverReset} */
  const hoverReset = () => {
    setApp((app) => {
      app.theme = -1
      app.task = -1
      app.day = -1
    })
  }

  /** @type {RemoveDay} */
  const removeDay = (theme, day) => {
    setThemes((themes) => {
      themes[theme].days.splice(day, 1)
      themes[theme].tasks.forEach(task => task.days.splice(day, 1))
    })
  }

  /** @type {RemoveTask} */
  const removeTask = (theme, task) => {
    const { title } = themes[theme].tasks[task]

    if (!window.confirm(`Are you sure you want to remove the task "${title}"?`)) return

    setThemes((themes) => {
      themes[theme].tasks.splice(task, 1)
    })
  }

  /** @type {RemoveTheme} */
  const removeTheme = (theme) => {
    const { date, title } = themes[theme]
    const str = date.toLocaleDateString()

    if (!window.confirm(`Are you sure you want to remove the theme "${title}" for ${str}?`)) return

    setThemes((themes) => {
      themes.splice(theme, 1)
    })
  }

  /** @type {ToggleDemo} */
  const toggleDemo = () => {
    setApp((app) => {
      app.demo = !app.demo

      setThemes((themes) => {
        themes.splice(0, themes.length, ...(app.demo ? parseThemes(demo) : loadThemes()))
      })
    })
  }

  /** @type {UpdateDay} */
  const updateDay = (theme, task, day) => {
    setThemes((themes) => {
      const days = themes[theme].tasks[task].days
      days[day] = nextStatus(days[day])
    })
  }

  /** @type {UpdateLabel} */
  const updateLabel = (theme, day, value) => {
    setThemes((themes) => {
      themes[theme].days[day] = value
    })
  }

  /** @type {UpdateTask} */
  const updateTask = (theme, task, attr, value) => {
    setThemes((themes) => {
      themes[theme].tasks[task][attr] = value
    })
  }

  /** @type {UpdateTheme} */
  const updateTheme = (theme, attr, value) => {
    setThemes((themes) => {
      themes[theme][attr] = value
    })
  }

  const actions = {
    addDay,
    addTask,
    addTheme,
    hoverDay,
    hoverReset,
    removeDay,
    removeTask,
    removeTheme,
    updateDay,
    updateLabel,
    updateTask,
    updateTheme
  }

  createEffect(() => !app.demo && saveThemes(themes))

  return (
    <AppContext.Provider value={[app, actions]}>
      <h1 class='uppercase tracking-[3px] m-3 px-3 flex items-center gap-2'>
        The Theme System

        <button
          class='px-2 py-1 mx-auto bg-blue-500 text-white rounded hover:bg-blue-400 transition duration-300'
          onClick={toggleDemo}
        >
          {app.demo ? 'Hide Demo' : 'Show Demo'}
        </button>

        <div class='text-gray-500'>
          Inspired by CGP Grey
        </div>

        /

        <a
          class='text-blue-500 hover:underline'
          title='This Journal Keeps Me Productive (& Maybe You Too)'
          href='https://www.youtube.com/watch?v=fSwpe8r50_o'
        >
          YouTube
        </a>

        /

        <a
          class='text-blue-500 hover:underline'
          title='“The Theme System Journal” graphic journal by Cortex Brand. | Cotton Bureau'
          href='https://cottonbureau.com/p/TZ4WZJ/journal/the-theme-system-journal'
        >
          Journal
        </a>
      </h1>

      <For each={themes}>
        {(theme, index) => (
          <Theme index={index()} {...theme} />
        )}
      </For>

      <div class='flex'>
        <button
          class='mx-4 px-4 border border-gray-400 h-8 hover:bg-gray-100 transition duration-300 cursor-pointer text-center'
          onClick={addTheme}
        >
          Add Theme
        </button>

        <div class='mx-4 ml-auto text-gray-400'>
          Data is saved to your browser local storage and persists between refreshes and restarts.
        </div>
      </div>
    </AppContext.Provider>
  )
}

/**
 * @returns {[AppContextState, AppContextActions]}
 */
export function useApp () {
  return useContext(AppContext)
}
