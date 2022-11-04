document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  fetch(`${baseAddress}/getUserDetails/${username}`)
    .then((res) => res.json())
    .then((response) => {
      getUserRoles(response)
      actionAfterGettingUserDetails(response);
    })
    .catch((err) => console.log(err));
});

// getting roles accroding to the user role
async function getUserRoles (response) {
    const {role} = response
    await fetch(`${baseAddress}/getUserRoles/${role}`)
      .then((res) => res.json())
      .then((response) => {
        populateRolesDropdown(response)
      })
      .catch((err) => console.log(err));
}

function populateRolesDropdown(itemsArr) {
  console.log(itemsArr);
  // itemsArr = [    "admin",    "manager",    "employee"]
  const roleInput = document.querySelector("#role");
  for (let i = 0; i < itemsArr.length; i++) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", itemsArr[i]);
    optionElement.setAttribute("id", itemsArr[i]);
    optionElement.textContent = itemsArr[i];
    roleInput.append(optionElement);
  }
}

function createViewForAdmin(name) {
  showMessage(name);
}
function createViewForEmployee(name) {
  showMessage(name);
}
function createViewForManager(name) {
  showMessage(name);
}

function showMessage(name) {
  const showMessage = document.querySelector("#text");
  const message = "Welcome" + " " + name;
  showMessage.innerHTML = message;
}

function actionAfterGettingUserDetails(response) {
  const { name, role } = response;
  switch (role) {
    case "admin":
      createViewForAdmin(name);
      break;
    case "employee":
      createViewForEmployee(name);
      break;
    case "manager":
      createViewForManager(name);
      break;
  }
}

function createUser() {
  const nameInput = document.querySelector('#name')
  const name = nameInput.value;
  const usernameInput = document.querySelector('#username')
  const username = usernameInput.value;
  const roleInput = document.querySelector('#role')
  const role = roleInput.value;
  const password = "pass123";
  fetch(`${baseAddress}/createUser`, {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name, username, role, password}),
  }).then(() => {
    console.log("User created successfully")
    
  })
  .catch(() =>console.log("Something went wrong"));
}

function checkUserExists() {
  const username = document.querySelector('#username')
  const userExistMessage = document.querySelector('#userExists')
  fetch(`${baseAddress}/checkUserExists/${username.value}`, {
    headers: {
      'Content-type': 'application/json'
    }
  }).then((res) => res.json())
  .then((data) => {
    console.log(data);
    if (data.found) {
      userExistMessage.textContent = "user already exists!!"
    }
    else {
      userExistMessage.textContent = "username available"
    }
  }) 
  
}


