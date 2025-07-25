import { createStore, produce } from 'solid-js/store'

/**
 * @param {T} init
 * @returns {[store: T, setStore: (producer: (store: T) => void) => void]}
 * @template {*} T
 */
export function createStoreProducer (init) {
  const [store, setStore] = createStore(init)
  return [store, (producer) => setStore(produce(producer))]
}
