import { createSlice } from '@reduxjs/toolkit'

export const TodoSlice = createSlice({
    name:"todos",
    initialState:{
        value:[]
    },
    reducers:{

        AddTodo: (state,action)=>{
            state.value.push(action.payload);
            localStorage.setItem('todoList', JSON.stringify(state.value));
        },

        RemoveTodo: (state,action)=>{
            const newTodoList = state.value.filter((todo)=> todo.id !== action.payload.id);
            state.value = newTodoList;
            localStorage.setItem('todoList', JSON.stringify(state.value));
        },

        SetTodoList: (state,action) => {
            state.value = action.payload;
            localStorage.setItem('todoList', JSON.stringify(state.value));
        },

        ToggleTodoCompleted: (state,action)=>{
            let todo = state.value.find((t)=> t.id === action.payload.id);
            if (todo!==null) {
                todo.isCompleted = !todo.isCompleted;
            }
            localStorage.setItem('todoList', JSON.stringify(state.value));
        },

        ClearAllCompleted: (state,action)=>{
            const newTodoList = state.value.filter((todo)=> todo.isCompleted === false);
            state.value = newTodoList;
            localStorage.setItem('todoList', JSON.stringify(state.value));
        }
    }
})

export const {AddTodo,RemoveTodo,SetTodoList,ToggleTodoCompleted,ClearAllCompleted} = TodoSlice.actions;

export default TodoSlice.reducer;