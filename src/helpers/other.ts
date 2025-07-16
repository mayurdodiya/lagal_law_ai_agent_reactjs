

export const sleep = (ms: number) => new Promise((r: (value: unknown) => void) => setTimeout(r, ms))