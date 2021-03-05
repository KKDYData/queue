# queue

![npm (tag)](https://img.shields.io/npm/v/@kkdy/queue?color=blue&style=for-the-badge) 
![Codecov](https://img.shields.io/codecov/c/github/KKDYData/queue?style=for-the-badge&token=XI749WLGTF)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/@kkdy/queue?style=for-the-badge)

Simple Async Queue for async/await.


## Install

```s
yarn add @kkdy/queue
```

## Usage

### Basic
```ts
import { Queue } from '@kkdy/queue'

// set concurrency = 10, default is 1
const q = Queue.of(10)

const expected = [1, 2, 3]
const result: number[] = []

expected.forEach((e) => {
  // pushTask will auto start the queue
  q.pushTask(() => {
    result.push(e)
    return Promise.resolve()
  })
})

await q.allDone()

```

### Init with an array of tasks
```ts

const result: number[] = []

const tasks = expected.map((e) => () => {
  result.push(e)
  return Promise.resolve()
})

const q = Queue.of(10, { queue: tasks })

// begin the queue
q.next()

```

### Use as a Promise

```ts
const result: number[] = []
const tasks = expected.map((e) => () => {
  result.push(e)
  return Promise.resolve()
})

await Queue.Promise(3, {
  queue: tasks,
})

```

### Catch error
```ts

// try/catch
try {
  await q.allDone()
} catch(err) {
  // todo
}

// promise

Queue.Promise(3, {
  queue: tasks,
})
  .catch(err => {})

```

### Use with hooks
```ts
Queue.of(10, {
  onError: (err) => {},
  finalTask: () => {},
  queue: tasks
})
```