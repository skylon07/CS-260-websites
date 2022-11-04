import { useEffect } from 'react'

export const baseUrl = "http://localhost:3000"

export function useAsyncEffect(asyncCallback, deps) {
    useEffect(() => {
        asyncCallback()
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}