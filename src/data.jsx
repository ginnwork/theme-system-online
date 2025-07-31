/**
 * @import { AppTheme } from './App.jsx'
 */

export const KEY_THEMES = 'theme-system:themes'

/**
 * @param {string} key Local storage item key to load.
 * @param {T} [init] Initial value to return if no data is found.
 * @returns {T}
 * @template {*} T
 */
export function load (key, init) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? init
  } catch (e) {
    window.alert('Failed to load themes: ' + e.message)
  }
}

/**
 * @returns {Array<AppTheme>}
 */
export function loadThemes () {
  return parseThemes(load(KEY_THEMES, []))
}

/**
 * @param {Array<AppTheme>} data Themes data to parse.
 * @returns {Array<AppTheme>}
 */
export function parseThemes (data) {
  for (const item of data) {
    if (item.date) item.date = new Date(item.date)
  }

  return data
}

/**
 * @param {string} key Local storage key to save to.
 * @param {*} data Data to save.
 * @returns {void}
 */
export function save (key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    window.alert('Failed to save themes: ' + e.message)
  }
}

/**
 * @param {Array<AppTheme>} themes Themes data to save.
 * @returns {void}
 */
export function saveThemes (themes) {
  save(KEY_THEMES, themes)
}
