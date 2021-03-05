import { callHook } from '../src/utils'

describe('utils - callHook', () => {
  test('call a hook normallly', () => {
    let a = 0
    const hook = () => a++
    callHook(hook)
    expect(a).toBe(1)
  })

  test('undefined hook', () => {
    const hook = undefined
    expect(callHook(hook)).toBeUndefined()
    expect(callHook()).toBeUndefined()
  })
})
