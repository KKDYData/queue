declare type Task = () => Promise<unknown>;
interface TaskQueueConfig {
    finalTask?: () => void;
    onError?: (e: Error) => void;
    queue?: Task[];
}
export declare class Queue {
    /**
     * @type Task[]
     */
    queue: Task[];
    concurrency: number;
    total: number;
    done: number;
    running: number;
    finalTask?: () => void;
    onError?: (e: Error) => void;
    constructor(concurrency: number, config?: Partial<TaskQueueConfig>);
    static of(concurrency?: number, config?: TaskQueueConfig): Queue;
    static Promise(concurrency: number, config: {
        queue: Task[];
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
