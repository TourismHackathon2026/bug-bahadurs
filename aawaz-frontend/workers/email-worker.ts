import { Worker } from "bullmq"
import { sendEmailImmediate } from "@/lib/email"

const QUEUE_NAME = "email-send"

function getRedisConnectionOptions() {
    const url = process.env.REDIS_URL || "redis://localhost:6379"
    if (!url) throw new Error("REDIS_URL is required for email worker")

    return { url }
}

const connection = getRedisConnectionOptions()

const worker = new Worker<{
    to: string
    subject: string
    text: string
    html?: string
    complaintLink?: string
}>(
    QUEUE_NAME,
    async (job) => {
        await sendEmailImmediate(job.data)
    },
    {
        connection,
        concurrency: 2,
        lockDuration: 30000,
    }
)

worker.on("completed", (job) => {
    console.log(`[Email Worker] Job completed ${job.id}`)
})

worker.on("failed", (job, err) => {
    console.error(`[Email Worker] Job failed ${job?.id}`, err)
})

worker.on("error", (error) => {
    console.error("[Email Worker] Worker error", error)
})

export { }
