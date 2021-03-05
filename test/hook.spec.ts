import { Queue } from '../src/index'
import { sleep } from './utils'

describe('hook mode', () => {
  const expected = [1, 2, 3]

  test('use finalTask hook', async () => {
    const finalTask = jest.fn()
    const q = Queue.of(3, {
      finalTask,
    })

    expected.forEach((e) => {
      q.pushTask(() => Promise.resolve())
    })

    await sleep(100)

    expect(finalTask).toBeCalled()
  })

  test('use onError hook', async () => {
    const onError = jest.fn()

    const tasks = expected.map((e) => () => Promise.resolve())
    tasks.push(() => Promise.reject(new Error('reject')))

    const q = Queue.of(3, {
      onError,
      queue: tasks,
    })

    q.next()

    await sleep(100)

    expect(onError).toBeCalled()
  })
})
