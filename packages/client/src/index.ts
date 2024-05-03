import fetch from 'cross-fetch'

type JobStatus = 'pending' | 'completed' | 'failed' | 'uploading'

type Upload = {
    key: string
    publicUrl: string
}

type JobEntity = {
    id: number
    status: JobStatus
    output_url?: Upload[]
    created_at: string
}

export default class StreamPot {
    protected secret: string
    protected baseUrl: string

    protected actions: any[] = []

    constructor({ secret, baseUrl = 'http://localhost:3000' }: { secret: string, baseUrl?: string }) {
        this.secret = secret
        this.baseUrl = baseUrl
    }

    protected addAction(name: string, value: any) {
        this.actions.push({ name, value })
    }

    async checkStatus(jobId: string) {
        const res = await fetch(`${this.baseUrl}/jobs/${jobId}`)
        return await res.json()
    }

    input(url: string) {
        this.addAction('input', url)
        return this
    }

    output(path: string) {
        this.addAction('output', path)
        return this
    }

    setStartTime(seek: string | number) {
        if (seek) {
            this.addAction('setStartTime', seek)
        }
        return this
    }

    setDuration(seek: string | number) {
        if (seek) {
            this.addAction('setDuration', seek)
        }
        return this
    }
    noAudio() {
        this.addAction('noAudio', null)
        return this
    }
    noVideo() {
        this.addAction('noVideo', null)
        return this
    }
    audioCodec(codec: string) {
        this.addAction('audioCodec', codec)
        return this
    }
    videoCodec(codec: string) {
        this.addAction('videoCodec', codec)
        return this
    }
    outputOptions(...options: (string | string[])[]) {
        this.addAction('outputOptions', options)
        return this
    }
    audioBitrate(bitrate: number) {
        this.addAction('audioBitrate', bitrate)
        return this
    }
    complexFilter(filters: object[] | string[]) {
        this.addAction('complexFilter', filters)
        return this
    }

    async run() {
        const response = await fetch(`${this.baseUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secret}`
            },
            body: JSON.stringify(this.actions)
        })

        return response.json() as Promise<JobEntity>
    }
}
