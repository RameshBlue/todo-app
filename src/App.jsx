import React, { useEffect, useRef, useState } from 'react'
import bgImageSrc from "../src/images/bg-desktop-light.jpg"
import iconMoon from "../src/images/icon-moon.svg"
import iconSun from "../src/images/icon-sun.svg"
import iconClose from "./images/icon-cross.svg"
import { useSelector, useDispatch } from 'react-redux'
import "./App.scss";
import { AddTodo, ClearAllCompleted, RemoveTodo, SetTodoList, ToggleTodoCompleted } from './features/TodoReducer'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

let portal = document.createElement("div");
document.body.appendChild(portal);

const App = () => {

  const TodoFieldRef = useRef();

  const [activeTodoState, setActiveTodoState] = useState(0);

  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.value);

  const [theme, setTheme] = useState('light');

  const ToggleTheme = () => {
    setTheme((curr) => curr === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {

    const todoListLocal = JSON.parse(localStorage.getItem('todoList'));
    if (todoListLocal != null) {
      dispatch(SetTodoList(todoListLocal));
    }
  }, [])

  const TodoElement = (todo, key) => {

    return (
      <Draggable key={todo.id} draggableId={todo.id.toString()} index={key}>
        {
          (provided, snapshot) => {

            if (snapshot.isDragging) {
              provided.draggableProps.style.left = undefined;
              provided.draggableProps.style.top = undefined;
            }

            return (
              <li className='todobox' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
              >
                <div className= {todo.isCompleted ? 'circle-hoverable checked' : 'circle-hoverable'} onClick={() => { dispatch(ToggleTodoCompleted(todo)) }}>
                   <div>&#x2713;</div>
                </div>

                <h2 style={{
                  textDecoration: `${todo.isCompleted ? 'line-through' : 'none'}`,
                }}>{todo.content}</h2>

                <img className='remove-todo' src={iconClose} alt='' onClick={() => {
                  dispatch(RemoveTodo(todo));
                }} />
              </li>
            )
          }
        }
      </Draggable>
    )
  }

  const AddTodoToList = (e) => {

    if (e.repeat) {
      return;
    }

    if (TodoFieldRef.current.value === "") {
      return;
    }

    if (e.keyCode === 13) {
      let todo = {
        id: todos.length === 0 ? 0 : todos[todos.length - 1].id + 1,
        content: TodoFieldRef.current.value,
        isCompleted: false
      }
      TodoFieldRef.current.value = "";
      dispatch(AddTodo(todo));
    }
  }

  const GetIsActiveLength = () => {
    return todos.filter(todo => todo.isCompleted === false).length;
  }

  function handleOnDragEnd(result) {

    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(SetTodoList(items));
  }


  return (
    <div id={theme} className='app-container'>

      <img src={bgImageSrc} alt='' />
      <div className='todo-container'>

        <div className='title-container'>
          <h1>TODO</h1>
          {
            theme === 'light' ? <img src={iconMoon} alt='' onClick={() => {
              ToggleTheme();
            }} /> : <img src={iconSun} alt='' onClick={() => {
              ToggleTheme();
            }} />
          }

        </div>

        <div className='todobox-create'>
          <div className='circle' />
          <input className='input-field' ref={TodoFieldRef} placeholder='Create new todo..' onKeyDown={AddTodoToList} />
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='todo-list' >
            {
              (provided) => (
                <ul className='todo-list' {...provided.droppableProps} ref={provided.innerRef}>
                  {
                    // eslint-disable-next-line array-callback-return
                    todos.map((todo, key) => {

                      switch (activeTodoState) {
                        case 0:
                          return TodoElement(todo, key);

                        case 1:
                          if (!todo.isCompleted) {
                            return TodoElement(todo, key);
                          }
                          break;

                        case 2:
                          if (todo.isCompleted) {
                            return TodoElement(todo, key);
                          }
                          break;

                        default:
                          break;
                      }
                    })
                  }
                  {provided.placeholder}

                  <div className='todo-statusbox'>
                    <h3>{GetIsActiveLength()} item{GetIsActiveLength() > 1 ? 's' : ''} left</h3>
                    <div>
                      <h3 className= {activeTodoState === 0 ? 'todostate todoStateSelected' :'todostate'}  onClick={() => {
                        setActiveTodoState(0)
                      }}>All</h3>
                      <h3 className= {activeTodoState === 1 ? 'todostate todoStateSelected' :'todostate'} onClick={() => {
                        setActiveTodoState(1)
                      }}>Active</h3>
                      <h3 className= {activeTodoState === 2 ? 'todostate todoStateSelected' :'todostate'} onClick={() => {
                        setActiveTodoState(2)
                      }}>Completed</h3>
                    </div>
                    <h3 onClick={() => {
                      dispatch(ClearAllCompleted());
                    }}>Clear Completed</h3>
                  </div>
                </ul>
              )
            }

          </Droppable>
        </DragDropContext>

        <div className='todo-statusbox-mobile'>
          <div>
            <h3 className= {activeTodoState === 0 ? 'todostate todoStateSelected' :'todostate'} onClick={() => {
              setActiveTodoState(0)
            }}>All</h3>
            <h3 className= {activeTodoState === 1 ? 'todostate todoStateSelected' :'todostate'} onClick={() => {
              setActiveTodoState(1)
            }}>Active</h3>
            <h3 className= {activeTodoState === 2 ? 'todostate todoStateSelected' :'todostate'} onClick={() => {
              setActiveTodoState(2)
            }}>Completed</h3>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App