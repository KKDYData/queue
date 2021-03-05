import { callHook } from './utils'

type Task = () => Promise<unknown>
type Queue = Task[]

interface TaskQueueConfig {
  finalTask: () => void
  onError: (e: Error) => void
  queue?: Queue
}

export class TaskQueue {
  /**
   * @type Queue
   */
  queue: Queue
  concurrency: number

  total = 0
  done = 0
  running = 0

  finalTask?: () => void
  onError?: (e: Error) => void

  constructor(concurrency: number, config: Partial<TaskQueueConfig> = {}) {
    this.concurrency = concurrency
    this.queue = config.queue || []
    this.finalTask = config.finalTask
    this.total += this.queue.length
    this.onError = config.onError

    return this
  }

  static of(concurrency: number = 1, config: TaskQueueConfig) {
    return new TaskQueue(concurrency, config)
  }

  static Promise(
    concurrency: number,
    config: {
      queue: Queue
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!config.queue.length) {
        resolve()
        return
      }
      const t = TaskQueue.of(concurrency, {
        onError: reject,
        finalTask: resolve,
        ...config,
      })
      t.next()
    })
  }

  pushTask(task: Task) {
    this.total++
    this.queue.push(task)
    this.next()
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()!
      task()
        .then(() => {
          this.running--
          this.done++
          this.next()
          if (this.isDone()) {
            console.log('Task is over')
            callHook(this.finalTask)
          }
        })
        .catch((err) => {
          callHook(this.onError, err)
        })
      this.running++
    }
  }

  isDone() {
    return this.running === 0 && this.queue.length === 0
  }

  /**
   * 等待队列完成
   */
  allDone() {
    return new Promise<void>((resolve, reject) => {
      if (this.isDone()) {
        return resolve()
      } else {
        this.finalTask = resolve
      }
    })
  }
}
