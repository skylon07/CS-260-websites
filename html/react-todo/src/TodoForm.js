import {createRef} from 'react'

function TodoForm({onSubmit}) {
    const taskInputRef = createRef()
    const getTaskInput = () => taskInputRef.current.value
    const resetTaskInput = () => taskInputRef.current.value = ""

    const submit = (event) => {
        event.preventDefault()

        if (typeof onSubmit === "function") {
            onSubmit(getTaskInput())
        }

        resetTaskInput()
    }

    return <form onSubmit={submit}>
        <label>
            Name:
            <input ref={taskInputRef} type="text" />
        </label>
        <input type="submit" value="Submit" />
    </form>
}

export default TodoForm
