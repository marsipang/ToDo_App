//Make selected list bold
window.onload = function() {
    const listnames = document.querySelectorAll('.list-name');
    const selectedlist = document.getElementById('activelist');
    for (let i = 0; i < listnames.length; i++){
        lname = listnames[i]
        if(selectedlist.innerText == lname.innerText){
            lname.style['font-weight'] = "bold";
            lname.style['color'] = "black";
        }
    }
}
var url = window.location.href;
//Show the form to create a new list if the option is clicked on
const CreateToggle = document.getElementById('add-list');
CreateToggle.onclick = function(e) {
    document.getElementById('list-form').className = '';
}
//Add a list when form is submitted
document.getElementById('list-form').onsubmit = function(e) {
    e.preventDefault();
    const listInput = document.getElementById('listname');
    const listname = listInput.value;
    listInput.value = '';
    fetch('/lists/create', {
        method: 'POST',
        body: JSON.stringify({
            'listname': listname,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('list-error').className = 'hidden';
        window.location.href = url.substring(0, url.lastIndexOf('/')) + '/' + data.listid;
    })
    .catch(function() {
        document.getElementById('list-error').className = '';
    })
}
//Remove a list when x is clicked
const rmlist = document.querySelectorAll('.remove-list');
for (let i = 0; i < rmlist.length; i++){
    const rmlistobj = rmlist[i]
    rmlistobj.onclick = function(e) {
        const rmlistId = e.target.dataset['id'];
        fetch('/lists/' + rmlistId + '/remove-list', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.success);
                var backurl = url.substring(0, url.lastIndexOf('/'))
                window.location.href = backurl.substring(0, backurl.lastIndexOf('/'));
              }
        })
        .catch(function() {
            document.getElementById('list-error').className = '';
        }) 
    }
}
//Show the form to create a new To-Do item if the option is clicked on
const ShowToDoForm = document.getElementById('add-todo');
ShowToDoForm.onclick = function(e) {
    document.getElementById('todo-form').className = '';
}
//Add a To-Do item when form is submitted
document.getElementById('todo-form').onsubmit = function(e) {
    e.preventDefault();
    const descInput = document.getElementById('todo-description');
    const desc = descInput.value;
    descInput.value = '';
    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'description': desc,
            'list_id': url.split('/').pop(),
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('list-error').className = 'hidden';
        window.location.href = url;
    })
    .catch(function() {
        document.getElementById('error').className = '';
    })
}
//Update a To-Do based on it's checkbox
const checkboxes = document.querySelectorAll('.check-completed');
for (let i = 0; i < checkboxes.length; i++){
    const checkbox = checkboxes[i]
    checkbox.onchange = function(e) {
        const newCompleted = e.target.checked;
        const todoId = e.target.dataset['id'];
        fetch('/todos/' + todoId + '/set-completed', {
            method: 'POST',
            body: JSON.stringify({
                'completed': newCompleted
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function() {
            document.getElementById('error').className = 'hidden';
        })
        .catch(function() {
            document.getElementById('error').className = '';
        })
    }
}
//Remove a list when x is clicked
const deletes = document.querySelectorAll('.remove-item');
for (let i = 0; i < deletes.length; i++){
    const deleteitem = deletes[i]
    deleteitem.onclick = function(e) {
        console.log('event', e);
        const todoId = e.target.dataset['id'];
        fetch('/todos/' + todoId + '/remove-item', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.success);
                window.location.href = url;
              }
        })
        .catch(function() {
            document.getElementById('list-error').className = '';
        })
    }
}
//Filter data shown as search is filled out
const searchform = document.getElementById('search-input');
searchform.onkeyup = function() {
    var input, filter, ul, li, i, txtValue;
    input = searchform;
    filter = input.value.toUpperCase();
    ul = document.getElementById("todos");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        console.log(li[i])
        txtValue = li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
//Checkmark all or uncheck all when link is clicked
const CheckAllButton = document.getElementById('check-all');
CheckAllButton.onclick = function(e) {
    console.log(checkboxes.checked);
    for (let i = 0; i < checkboxes.length; i++){
        const checkbox = checkboxes[i]
        checkbox.checked = true;
    }
    fetch('/lists/' + url.split('/').pop() + '/set-completed', {
        method: 'POST'
    })
    .then(function() {
        console.log()
        document.getElementById('error').className = 'hidden';
    })
    .catch(function() {
        document.getElementById('error').className = '';
    })
}