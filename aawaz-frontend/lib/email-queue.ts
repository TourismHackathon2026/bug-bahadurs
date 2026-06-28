import { Queue } from "bullmq"

const QUEUE_NAME = "email-send"

function getRedisConnectionOptions() {
    const url = process.env.REDIS_URL
    if (!url) return null

    return { url }
}

const globalForQueue = globalThis as unknown as {
    emailQueue?: Queue
}

function getEmailQueue(): Queue | null {
    if (!process.env.REDIS_URL) return null

    if (!globalForQueue.emailQueue) {
        const connection = getRedisConnectionOptions()
        if (!connection) return null

        globalForQueue.emailQueue = new Queue(QUEUE_NAME, {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: "exponential", delay: 5000 },
                removeOnComplete: true,
                removeOnFail: { age: 7 * 24 * 60 * 60 },
            },
        })

        globalForQueue.emailQueue.on("error", (error) => {
            console.error("[Email Queue] Queue error", error)
        })
    }

    return globalForQueue.emailQueue ?? null
}

export type EmailJobData = {
    to: string
    subject: string
    text: string
    html?: string
    complaintLink?: string
}

export async function addEmailJob(data: EmailJobData): Promise<void> {
    const queue = getEmailQueue()
    if (!queue) {
        throw new Error("Redis URL is required to enqueue email jobs.")
    }

    await queue.add("send-email", data)
}

export function isEmailQueueEnabled(): boolean {
    return Boolean(process.env.REDIS_URL)
}
