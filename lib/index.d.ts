declare type Task = () => Promise<unknown>;
declare type Queue = Task[];
interface TaskQueueConfig {
    finalTask: () => void;
    onError: (e: Error) => void;
    queue?: Queue;
}
export declare class TaskQueue {
    /**
     * @type Queue
     */
    queue: Queue;
    concurrency: number;
    total: number;
    done: number;
    running: number;
    finalTask?: () => void;
    onError?: (e: Error) => void;
    constructor(concurrency: number, config?: Partial<TaskQueueConfig>);
    static of(concurrency: number | undefined, config: TaskQueueConfig): TaskQueue;
    static Promise(concurrency: number, config: {
        queue: Queue;
    }): Promise<void>;
    pushTask(task: Task): void;
    next(): void;
    isDone(): boolean;
    /**
     * 等待队列完成
     */
    allDone(): Promise<void>;
}
export {};
