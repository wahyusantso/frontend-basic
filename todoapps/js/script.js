const todos = [];
const RENDER_EVENT = 'render-todo';
/*
Variabel RENDER_EVENT bertujuan untuk mendefinisikan Custom Event dengan nama 'render-todo'. 
Custom event ini digunakan sebagai patokan dasar ketika ada perubahan data pada variabel todos, 
seperti perpindahan todo (dari incomplete menjadi complete, dan sebaliknya), menambah todo, maupun menghapus todo.
*/

document.addEventListener('DOMContentLoaded', function () {
    //DOMContentLoaded ketika semua elemen HTML sudah dimuat.
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    document.addEventListener(RENDER_EVENT, function () {
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = ''; //memastikan agar container dari todo bersih sebelum diperbarui. agar tidak terjadi duplikasi

        const completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerText = '';

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) { //kondisi if statement untuk mem-filter hanya todo “Yang harus dibaca” saja lah yang perlu ditampilkan.
                uncompletedTODOList.append(todoElement);
            } else {
                completedTODOList.append(todoElement);
            }
            
        }
    })
});

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generatedId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));//me-render data yang telah disimpan pada array todos.
}

function generatedId() {
    return + new Date();
    /*
    generateId() berfungsi untuk menghasilkan identitas unik pada setiap item todo. 
    Untuk menghasilkan identitas yang unik, kita manfaatkan +new Date() untuk mendapatkan timestamp pada JavaScript.
     */
}

function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id, 
        task,
        timestamp,
        isCompleted
    }
    /* 
    generateTodoObject() berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan (parameter function), 
    diantaranya id, nama todo (task), waktu (timestamp), dan isCompleted (penanda todo apakah sudah selesai atau belum).
    */
}

function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT)); //kemudian panggil event RENDER_EVENT untuk memperbarui data yang ditampilkan.
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1); //menghapus todo tersebut menggunakan fungsi splice() 
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }

    return -1;
}