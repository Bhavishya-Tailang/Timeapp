document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem('username');
    fetch('http://localhost:3000/getUserRoles/')
      .then((res) => res.json())
      .then((response) => {
        populateRolesDropdown(response)
      })
      .catch((err) => console.log(err));

});

function populateRolesDropdown(itemsArr) {
    console.log(itemsArr)
    // itemsArr = [    "admin",    "manager",    "employee"]
    const roleInput = document.querySelector('#roles')
    for(let i = 0; i < itemsArr.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', itemsArr[i]);
        optionElement.setAttribute('id', itemsArr[i]);
        optionElement.textContent = itemsArr[i];
        roleInput.append(optionElement)
    }
}

function initiateLogin() {
    localStorage.removeItem('username');
    const userNameInput = document.querySelector('#username');
    const username = userNameInput.value;
    // userNameInput.value = "";
    const roleInput = document.querySelector('#roles');
    const role = roleInput.value;
    // roleInput.value = "";
    const passwordInput = document.querySelector('#password');
    const password = passwordInput.value;
    passwordInput.value = "";
    fetch('http://localhost:3000/checkLogin', {
        headers: {
            'Content-type': 'application/json',
            'WWW-Authenticate': 'FormBased'
        },
        method: 'POST',
        body: JSON.stringify({username, role, password}),
    }).then((res) => res.json())
    .then((data) => {
        if(data.status!==200){
           throw new Error(data.message)
        }
       redirectToDashboard(username)
    })
    .catch((error) => {
        console.log(error)
        showErrorMessage()
    });
}


function redirectToDashboard(username) {
    const message = "Login Successful, redirecting..."
    localStorage.setItem('username', username);
    showMessage(message)
    document.querySelector('#login-btn')
    
    setTimeout(() => {
        window.location.replace("/client/dashboard/dashboard.html");
    },1500)
}


function showErrorMessage() {
    const message = "Login Failed."
    showMessage(message)
    // localStorage.removeItem('username');
}

function showMessage(message) {
    const showMessage = document.querySelector('#redirect h4');
    console.log(showMessage);
    showMessage.innerHTML = message;
    showMessage.hidden = false;
}