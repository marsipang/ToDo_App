//Make selected list bold
window.onload = function() {
    const listnames = document.querySelectorAll('.list-name');
    const selectedlist = document.getElementById('activelist');
    for (let i = 0; i < listnames.length; i++){
        lname = listnames[i]
        if(selectedlist.innerText == lname.innerText){
            console.log(lname.innerText);
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
