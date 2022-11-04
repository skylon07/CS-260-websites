import { useEffect } from 'react'

export function useAsyncEffect(asyncCallback, deps) {
    useEffect(() => {
        asyncCallback()
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
