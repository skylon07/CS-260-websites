// imports error for some reason...
const {useState, createRef} = React

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

Component(function Root() {
    const [tasks, setTasks] = useState([
        {task: "Wash Clothes", completed: false},
        {task: "Sweep Floor", completed: true}
    ])
    const [cleared, setCleared] = useState(false)

    const clearDivRef = createRef()
    
    const addTask = (newTaskDesc) => {
        setTasks((prevTasks) => {
            let uniqueTaskDesc = newTaskDesc
            while (prevTasks.map(task => task.task).includes(uniqueTaskDesc)) {
                uniqueTaskDesc = `${uniqueTaskDesc}-copy`
            }
    
            const newTask = {
                task: uniqueTaskDesc,
                completed: false,
            }

            return prevTasks.concat([newTask])
        })
    }
    const clearCompletedTasks = () => {
        setTasks((prevTasks) => prevTasks.filter((task) => !task.completed))
    }
    
    const taskElems = tasks.map((task, idx) => {
        const toggleTask = () => {
            setTasks((prevTasks) => {
                const newTasks = [...prevTasks]
                const newTask = {...task, completed: !task.completed}
                newTasks[idx] = newTask
                return newTasks
            })
        }
        return <Task
            key={task.task}
            desc={task.task}
            completed={task.completed}
            onClick={toggleTask}
        />
    })
    
    const clearPageOnDelete = (event) => {
        if (event.target === clearDivRef.current) {
            const isDeleteEvent = ["Backspace", "Delete"].includes(event.key)
            if (isDeleteEvent) {
                setCleared(true)
            }
        }
    }

    if (!cleared) {
        return <div ref={clearDivRef} tabIndex={0} onKeyDown={clearPageOnDelete}>
            <h1> Todo List </h1>
            <TodoForm onSubmit={addTask} />
            <ul>{taskElems}</ul>
            <button onClick={clearCompletedTasks}>Clear Completed</button>
        </div>
    } else {
        return null
    }
})

Component(function TodoForm({onSubmit}) {
    const taskInputRef = createRef()
    const getTaskInput = () => taskInputRef.current.value
    const resetTaskInput = () => taskInputRef.current.value = ""

    const submit = alertOnErrorCallback("TodoForm.submit", (event) => {
        event.preventDefault()

        if (typeof onSubmit === "function") {
            onSubmit(getTaskInput())
        }

        resetTaskInput()
    })

    return <form onSubmit={submit}>
        <label>
            Name:
            <input ref={taskInputRef} type="text" />
        </label>
        <input type="submit" value="Submit" />
    </form>
})

Component(function Task({desc, completed, onClick}) {
    const completedClass = completed ? "done" : ""
    const taskClass = `Task ${completedClass}`
    return <li onClick={onClick} className={taskClass}>{desc}</li>
})
