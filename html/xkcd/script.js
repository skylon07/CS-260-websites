// imports error for some reason...
const {useState, useEffect, useRef, useCallback} = React

function alertOnError(context, fn, ...args) {
    try {
        const result = fn(...args)
        if (result instanceof Promise) {
            result.catch((e) => {
                alert(`Error (async) in ${context}: ${e}`)
                console.error(`Error (async) in ${context}: ${e}`)
            })
        }
        return result
    } catch (e) {
        alert(`Error in ${context}: ${e}`)
        console.error(`Error in ${context}: ${e}`)
    }
}

function alertOnErrorCallback(context, fn) {
    return (...args) => alertOnError(context, fn, ...args)
}

function Component(fn) {
    globalThis[fn.name] = alertOnErrorCallback(`Component ${fn.name}`, fn)
}

class XKCD {
    static _baseUrl = "https://xkcd.vercel.app/?comic="

    static async getComic(id) { return await alertOnError("XKCD.getComic", async () => {
        const comicUrl = `${XKCD._baseUrl}${id}`
        const response = await axios.get(comicUrl)
        return response
    })}

    static async getLatestComic() { return await alertOnError("XKCD.getLatestComic", async () => {
        const comicUrl = `${XKCD._baseUrl}latest`
        const response = await axios.get(comicUrl)
        return response
    })}
}

function useAsyncEffect(asyncCallback, deps) {
    const isAliveRef = useRef(true)
    useEffect(() => {
        asyncCallback(isAliveRef)
        return () => {
            isAliveRef.current = false
        }
    }, deps)
}

function useStableCallback(callback) {
    const callbackRef = useRef(callback)
    return callbackRef.current
}

function setByAsync(setState, asyncCallback) {
    setState((prevState) => {
        !(async () => {
            const newState = await asyncCallback(prevState)
            setState(newState)
        })()
        return prevState
    })
}

Component(function Root() {
    const [comic, setComic] = useState(null)
    const [latestComicNum, setLatestComicNum] = useState(null)

    async function getComic(num) {
        const response = await XKCD.getComic(num)
        if (response.data.num > latestComicNum) {
            setLatestComicNum(response.data.num)
        }
        return response
    }
    async function getLatestComic() {
        const response = await XKCD.getLatestComic()
        setLatestComicNum(response.data.num)
        return response
    }
    
    useAsyncEffect(async function initializeComic(isAliveRef) {
        if (comic === null) {
            const timeoutPromise_cuzWhyNot = new Promise((res) => {
                setTimeout(res, 800)
            })
            await timeoutPromise_cuzWhyNot
            
            const isStillAlive = isAliveRef.current
            if (isStillAlive) {
                const newComic_response = await XKCD.getLatestComic()
                const isStillStillAlive = isAliveRef.current
                if (isStillStillAlive) {
                    setComic(newComic_response.data)
                    setLatestComicNum(newComic_response.data.num)
                }
            }
        }
    }, [comic])

    async function loadFirstComic() {
        setByAsync(setComic, async (prevComic) => {
            const newComic_response = await getComic(1)
            return newComic_response.data
        })
    }

    async function loadPrevComic() {
        setByAsync(setComic, async (prevComic) => {
            const newNum = prevComic.num > 1 ? prevComic.num - 1 : 1
            const newComic_response = await getComic(newNum)
            return newComic_response.data
        })
    }

    async function loadNextComic() {
        setByAsync(setComic, async (prevComic) => {
            let newComic_response
            if (prevComic.num < latestComicNum) {
                const newNum = prevComic.num + 1
                newComic_response = await getComic(newNum)
            } else {
                newComic_response = await getLatestComic()
            }
            return newComic_response.data
        })
    }

    async function loadLatestComic() {
        setByAsync(setComic, async (prevComic) => {
            const newComic_response = await getLatestComic()
            return newComic_response.data
        })
    }

    const isLoadingComic = comic === null
    if (isLoadingComic) {
        return <div>
            <h1>Loading comic...</h1>
        </div>
    } else {
        return <div>
            <h1>XKCD Comics</h1>
            <div>
                <h2>{comic.title}</h2>
                <img src={comic.img}></img>
                <p><i>#{comic.num}, drawn on {comic.month}-{comic.day}-{comic.year}</i></p>
                <p>{comic.alt}</p>
                <button onClick={loadFirstComic}>First</button>
                <button onClick={loadPrevComic}>Previous</button>
                <button onClick={loadNextComic}>Next</button>
                <button onClick={loadLatestComic}>Latest</button>
            </div>
        </div>
    }
})
