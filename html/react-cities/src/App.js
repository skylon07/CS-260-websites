import { useState, createRef } from 'react'
import './App.css';

function App() {
    const [value, setValue] = useState("")
    const [cities, setCities] = useState([
        { city: "Provo" },
        { city: "Lindon" },
    ])

    const inputRef = createRef()

    const recordInput = (event) => {
        const newValue = inputRef.current.value
        setValue(newValue)
    }
    const submit = async (event) => {
        event.preventDefault()

        const url = `https://csonline.byu.edu/city?q=${value}`
        const data = await fetch(url)
        const json = await data.json()
        setCities(json)
    }

    const cityElems = cities.map((city) => {
        const cityName = city.city
        return <li key={cityName}>{cityName}</li>
    })

    return <div>
        <form onSubmit={submit} onKeyUp={(event) => { recordInput(event); submit(event) }}>
            <label>
                Name:
                <input ref={inputRef} type="text" value={value} onChange={recordInput} />
            </label>
            <input type="submit" value="Submit" />
            <ul>{cityElems}</ul>
        </form>
    </div>
}

export default App;
