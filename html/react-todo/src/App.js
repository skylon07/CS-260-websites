import {useState, createRef} from 'react'
import "./App.css"

import Task from "./Task"
import TodoForm from "./TodoForm"

function App() {
    const [tasks, setTasks] = useState([
        { task: "Wash Clothes", completed: false },
        { task: "Sweep Floor", completed: true }
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
                const newTask = { ...task, completed: !task.completed }
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
}

export default App;
