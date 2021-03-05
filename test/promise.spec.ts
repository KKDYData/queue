import { Queue } from '../src/index'
import { sleep } from './utils'

describe.only('Promise mode', () => {
  const expected = [1, 2, 3]

  test('normal', async () => {
    const result: number[] = []
    const tasks = expected.map((e) => () => {
      result.push(e)
      return Promise.resolve()
    })

    await Queue.Promise(3, {
      queue: tasks,
    })

    expect(result).toEqual(expected)
  })

  test('on Error', async () => {
    const tasks = expected.map((e) => () => Promise.resolve())
    tasks.push(() => Promise.reject(new Error('reject')))

    await expect(
      Queue.Promise(3, {
        queue: tasks,
      })
    ).rejects.toThrow('reject')
  })

  test('zero queue', async () => {
    await expect(Queue.Promise(10, { queue: [] })).resolves.toBeUndefined()
  })

  test('zero queue - allDone', async () => {
    const q = Queue.of(10, { queue: [] })
    q.next()
    await expect(q.allDone()).resolves.toBeUndefined()
  })
})
