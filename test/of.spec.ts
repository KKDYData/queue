import { Queue } from '../src/index'

describe('Queue.of', () => {
  const expected = [1, 2, 3]

  test('base', async () => {
    const q = Queue.of(10)

    const result: number[] = []
    expected.forEach((e) => {
      q.pushTask(() => {
        result.push(e)
        return Promise.resolve()
      })
    })

    await q.allDone()

    expect(result).toEqual(expected)

    expect(q.isDone()).toBe(true)
  })

  test('on Error', async () => {
    const q = Queue.of(10)

    expected.forEach((e, i) => {
      q.pushTask(() => {
        if (i > 1) return Promise.reject('reject')
        else return Promise.resolve()
      })
    })

    await expect(q.allDone()).rejects.toEqual('reject')

    expect(q.isDone()).toBe(false)
  })

  test('throw Error', async () => {
    const q = Queue.of(10)

    expected.forEach((e, i) => {
      q.pushTask(() => {
        if (i > 1) return Promise.reject(new Error('reject'))
        else return Promise.resolve()
      })
    })

    await expect(q.allDone()).rejects.toThrow('reject')

    expect(q.isDone()).toBe(false)
  })

  test('init with array', async () => {
    const result: number[] = []

    const tasks = expected.map((e) => () => {
      result.push(e)
      return Promise.resolve()
    })

    const q = Queue.of(10, { queue: tasks })
    q.next()

    await q.allDone()

    expect(result).toEqual(expected)
    expect(q.isDone()).toBe(true)
  })

  test('length 3 concurrency 3', async () => {
    const tasks = expected.map((e) => () => {
      if (e === 0) {
        expect(q.queue.length).toBe(0)
      }
      return Promise.resolve()
    })

    const q = Queue.of(3, { queue: tasks })

    expect(q.queue.length).toBe(expected.length)

    q.next()

    await q.allDone()
    expect(q.isDone()).toBe(true)
  })

  test('length 3 concurrency 2', async () => {
    const tasks = expected.map((e) => () => {
      if (e === 0) {
        expect(q.queue.length).toBe(1)
      }
      return Promise.resolve()
    })

    const q = Queue.of(2, { queue: tasks })

    expect(q.queue.length).toBe(expected.length)

    q.next()

    await q.allDone()
    expect(q.isDone()).toBe(true)
  })
})
