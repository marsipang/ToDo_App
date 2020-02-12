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
  const deletes = document.querySelectorAll('.remove-item');
  for (let i = 0; i < deletes.length; i++){
    const deleteitem = deletes[i]
    deleteitem.onclick = function(e) {
      console.log('event', e);
      const todoId = e.target.dataset['id'];
      fetch('/todos/' + todoId + '/remove-item', {
        method: 'DELETE'
      });
    }
  }
      const descInput = document.getElementById('todo-description');
      document.getElementById('todo-form').onsubmit = function(e) {
        e.preventDefault();
        const desc = descInput.value;
        descInput.value = '';
        fetch('/todos/create', {
          method: 'POST',
          body: JSON.stringify({
            'description': desc,
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(jsonResponse => {
          console.log('response', jsonResponse);
          li = document.createElement('li');
          li.innerText = desc;
          document.getElementById('todos').appendChild(li);
          document.getElementById('error').className = 'hidden';
        })
        .catch(function() {
          document.getElementById('error').className = '';
        })
      }