document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-todo').addEventListener('click', addTodo);
    renderTodos(); // Call renderTodos to display any stored todos on load
});

function addTodo() {
    const todoText = document.getElementById('new-todo-text').value;
    if (todoText.trim() !== '') {
        chrome.storage.sync.get({todos: []}, function(data) {
            const todos = data.todos;
            todos.push({text: todoText, completed: false});
            chrome.storage.sync.set({todos}, function() {
                renderTodos(); // Refresh the todo list display
                document.getElementById('new-todo-text').value = ''; // Clear input field after adding
            });
        });
    } else {
        alert('Please enter a todo item.'); // Provide user feedback for empty input
    }
}

function renderTodos() {
    chrome.storage.sync.get({todos: []}, function(data) {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ''; // Clear current todos before rendering updated list
        data.todos.forEach(function(todo, index) {
            const todoElement = document.createElement('div');
            const todoText = document.createElement('span');
            todoText.textContent = todo.text;
            todoElement.appendChild(todoText);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.setAttribute('class', 'edit-button');
            editButton.addEventListener('click', function() { editTodo(index); });
            todoElement.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('class', 'delete-button');
            deleteButton.addEventListener('click', function() { deleteTodo(index); });
            todoElement.appendChild(deleteButton);

            todoList.appendChild(todoElement);
        });
    });
}

function editTodo(index) {
    chrome.storage.sync.get({todos: []}, function(data) {
        const todos = data.todos;
        const newText = prompt("Edit Todo:", todos[index].text);
        if (newText !== null && newText !== '') {
            todos[index].text = newText;
            chrome.storage.sync.set({todos}, function() {
                renderTodos(); // Re-render todos to reflect the edit
            });
        }
    });
}

function deleteTodo(index) {
    chrome.storage.sync.get({todos: []}, function(data) {
        const todos = data.todos;
        todos.splice(index, 1); // Remove the todo item
        chrome.storage.sync.set({todos}, renderTodos); // Re-render todos to reflect the deletion
    });
}