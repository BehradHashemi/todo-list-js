const $ = document;
const taskInput = $.getElementById("task-input");
const dateInput = $.getElementById("date-input");
const addButton = $.getElementById("add-button");
const editButton = $.getElementById("edit-button");
const deleteAllTask = $.getElementById("delete-all-button");
const todosBody = $.querySelector("tbody");
const filterButtons = $.querySelectorAll(".filter-todos");

const alertMessage = $.getElementById("alert-msg");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generatorId = () => {
    return Math.round((Math.random() * Math.random()) * Math.pow(10, 10)).toString()
};

const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
};

const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = $.createElement("p");
    alert.innerText = message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.append(alert);

    setTimeout(() => {
        alert.style.display = "none"
    }, 2000)
};

const displayTodos = (data) => {
    const todoList = data ? data : todos;

    todosBody.innerHTML = "";

    if (!todoList.length) {
        todosBody.innerHTML = "<tr><td colspan='4'>هیچ کاری ذخیره نشده است</td></tr>";
        return;
    };
    todoList.forEach(todo => {
        todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "بدون تاریخ"}</td>
            <td>${todo.completed ? "تکمیل شد" : "در حال انتظار"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">ویرایش</button>
                <button onclick="toggleHandler('${todo.id}')">${todo.completed ? "لغو کردن" : "انجام دادن"}</button>
                <button onclick="deleteHandler('${todo.id}')">حذف</button>
            </td>
        </tr>
        `
    });
};

const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id: generatorId(),
        task,
        date,
        completed: false,
    };
    if (task) {
        todos.push(todo);
        saveToLocalStorage();
        displayTodos();
        taskInput.value = "";
        dateInput.value = "";
        showAlert("کار شما با موفقیت اضافه شد", "success")
        console.log(todos);
    } else {
        showAlert("لطفا مقداری را وارد کنید!", "error")
    }
};

const deleteAllHandler = () => {
    if (todos.length) {
        todos = [];
        saveToLocalStorage();
        displayTodos();
        showAlert("لیست کار شما با موفقیت پاک شد", "success");
    } else {
        showAlert("لیست کار شما خالیست", "error");
    }
};

const deleteHandler = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displayTodos();
    showAlert("با موفقیت حذف شد", "success");
};

const toggleHandler = (id) => {
    // Method-1 
    // const newTodos = todos.map(todo => {
    //     if (todo.id === id) {
    //         return {
    //             ...todo,
    //             completed: !todo.completed
    //         }
    //     } else {
    //         return todo;
    //     }
    // });
    // todos = newTodos;

    // Method-2 => Best Performance
    const todo = todos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;


    saveToLocalStorage();
    displayTodos();
    showAlert("وضعیت لیست شما تغییر کرد", "success");
};


const editHandler = (id) => {
    const todo = todos.find(todo => todo.id === id)
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addButton.style.display = "none";
    editButton.style.display = "inline-block";
    editButton.dataset.id = id;
};

const applyEditHandler = (e) => {
    const id = e.target.dataset.id;
    const todo = todos.find((todo) => todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    taskInput.value = "";
    dateInput.value = "";
    addButton.style.display = "inline-block";
    editButton.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    showAlert("لیست شما ویرایش شد", "success");
};

const filterHandler = (e) => {
    let filteredTodos = null;
    const filter = e.target.dataset.filter;

    switch (filter) {
        case "pending":
            filteredTodos = todos.filter(todo => todo.completed === false);
            break;

        case "completed":
            filteredTodos = todos.filter(todo => todo.completed === true);
            break;

        default:
            filteredTodos = todos;
            break;
    }
    displayTodos(filteredTodos);
};

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllTask.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach(button => button.addEventListener("click", filterHandler))