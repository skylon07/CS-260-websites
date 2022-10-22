import "./Task.css"

function Task({completed, onClick, desc}) {
    const completedClass = completed ? "done" : ""
    const taskClass = `Task ${completedClass}`
    return <li onClick={onClick} className={taskClass}>{desc}</li>
}

export default Task
