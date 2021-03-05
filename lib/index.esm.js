function callHook(hook, ...args) {
    if (hook) {
        return hook(...args);
    }
}

class TaskQueue {
    constructor(concurrency, config = {}) {
        this.total = 0;
        this.done = 0;
        this.running = 0;
        this.concurrency = concurrency;
        this.queue = config.queue || [];
        this.finalTask = config.finalTask;
        this.total += this.queue.length;
        this.onError = config.onError;
        return this;
    }
    static of(concurrency = 1, config) {
        return new TaskQueue(concurrency, config);
    }
    static Promise(concurrency, config) {
        return new Promise((resolve, reject) => {
            if (!config.queue.length) {
                resolve();
                return;
            }
            const t = TaskQueue.of(concurrency, Object.assign({ onError: reject, finalTask: resolve }, config));
            t.next();
        });
    }
    pushTask(task) {
        this.total++;
        this.queue.push(task);
        this.next();
    }
    next() {
        while (this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            task()
                .then(() => {
                this.running--;
                this.done++;
                this.next();
                if (this.isDone()) {
                    console.log('Task is over');
                    callHook(this.finalTask);
                }
            })
                .catch((err) => {
                callHook(this.onError, err);
            });
            this.running++;
        }
    }
    isDone() {
        return this.running === 0 && this.queue.length === 0;
    }
    /**
     * 等待队列完成
     */
    allDone() {
        return new Promise((resolve, reject) => {
            if (this.isDone()) {
                return resolve();
            }
            else {
                this.finalTask = resolve;
            }
        });
    }
}

export { TaskQueue };
