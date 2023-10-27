import './App.css';
import React, {useEffect, useRef, useState} from 'react';
import ic_close from './images/ic_close.svg'

function App() {
    return (
        <Todo/>
    );
}

function Todo() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [todo_id, setID] = useState(1)
    const [isInputFocused, setInputFocused] = useState(false);

    const handleAddTodo = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            if (input.trim() === '') return
            setTodos([...todos, { text: input, completed: false, id: todo_id }]);
            setInput('');
            setID(todo_id + 1)
            event.target.style.height = "30px"
        }
    };

    const handleToggleComplete = id => {
        const newTodos = [...todos]
        const foundTodo = newTodos.find((todo) => {
            return todo.id === id
        })
        foundTodo.completed = !foundTodo.completed
        setTodos(newTodos)
    };

    const handleDeleteTodo = id => {
        const newTodos = [...todos]
        setTodos(newTodos.filter((todo) => {
            return todo.id !== id
        }))
    }

    const handleEditTodo = (id, text) => {
        if (text.trim() !== '') {
            const newTodos = [...todos]
            const foundTodo = newTodos.find((todo) => {
                return todo.id === id
            })
            foundTodo.text = text
            setTodos(newTodos)
        } else {
            handleDeleteTodo(id)
        }
    }

    return (
        <div>
            <div className="textareaAddNewTodo">
                <textarea
                    id="input"
                    rows={1}
                    value={input}
                    required
                    onKeyDown={handleAddTodo}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onChange={e => {
                        setInput(e.target.value)
                        e.target.style.height = '30px';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
                <label htmlFor="input">Новый пункт</label>
            </div>

            <TodoList
                handleDeleteTodo={handleDeleteTodo}
                handleCompleteTodo={handleToggleComplete}
                handleEditTodo={handleEditTodo}
                todos={todos.filter(
                    (todo) => {
                        return !todo.completed
                    }
                ).reverse()}
            />

            <hr className={`barrier ${isInputFocused ? 'focused' : ''}`}/>

            <TodoList
                handleDeleteTodo={handleDeleteTodo}
                handleCompleteTodo={handleToggleComplete}
                handleEditTodo={handleEditTodo}
                todos={todos.filter(
                    (todo) => {
                        return todo.completed
                    }
                ).reverse()}
            />
        </div>
    );
}

function TodoList({todos, handleDeleteTodo, handleCompleteTodo, handleEditTodo}) {
    return (
        <div className="todoList">
            <div>
                {todos.map((todo) => (
                    <TodoItem
                        todo={todo}
                        handleDeleteTodo={handleDeleteTodo}
                        handleCompleteTodo={handleCompleteTodo}
                        handleEditTodo={handleEditTodo}
                    />
                ))}
            </div>
        </div>
    )
}

function TodoItem({todo, handleDeleteTodo, handleCompleteTodo, handleEditTodo}) {
    const [editableText, setEditableText] = React.useState(todo.text);
    const textareaRef = useRef(null);

    useEffect(() => {
        setEditableText(todo.text);
    }, [todo.text]);

    useEffect(() => {
        if (textareaRef.current) {
            setTimeout(() => {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }, 0)
        }
    }, [todo.text])

    return (
        <div key={todo.id} className="todoItem">
            <div className="todoItemWithoutCheckBox">
                <input
                    id="todoCheckBox"
                    className="checkBox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleCompleteTodo(todo.id)}
                />
                <textarea
                    rows={1}
                    ref={textareaRef}
                    value={editableText}
                    className={`todoText ${todo.completed ? 'completed' : ''} e.t.`}
                    onBlur={() => handleEditTodo(todo.id, editableText)}
                    onChange={(event) => {
                        setEditableText(event.target.value);
                        event.target.style.height = 'auto';
                        event.target.style.height = `${event.target.scrollHeight}px`;
                    }}
                />
            </div>

            <button onClick={() => handleDeleteTodo(todo.id)}>
                <img src={ic_close} alt="delete" width={20} height={20}/>
            </button>
        </div>
    )
}

export default App;
