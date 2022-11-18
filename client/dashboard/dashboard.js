// this will be called on page load
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  // api to get details of user {name, role, username, defaultPasswordChanged}
  fetch(`${baseAddress}/getUserDetails/${username}`)
    .then((res) => res.json()) // returning response in json form
    .then((response) => {
      getUserRoles(response) // called to get roles on the basis of username in api parameter
      actionAfterGettingUserDetails(response) // called to get view of admin, manager or employee
      getUserRolesEdit(response)  // called to get roles in edit modal on the basis of username in api parameter
      getAllUsers()       // called to get user details without detials of admin.
      hideShowSpan(response)  // called to show or hide change password message on the basis of default password change in getUserDetails api
    })
    .catch((err) => console.log(err));
});

// getting roles accroding to the user role
async function getUserRoles (response) { // response received from getUserDetails api
    const { role }= response
    
    await fetch(`${baseAddress}/getUserRoles/${role}`)    //api to get roles the respective manager/admin can assign while creating any user
      .then((res) => res.json())
      .then((response) => {
        populateRolesDropdown(response) // function to populate roles in the roles dropdown
      })
      .catch((err) => console.log(err));
}

function populateRolesDropdown(itemsArr) {                                  // function to add roles in dropdown
  console.log(itemsArr);
  // itemsArr = [    "admin",    "manager",    "employee"]
  const roleInput = document.querySelector("#role");
  for (let i = 0; i < itemsArr.length; i++) {
    const optionElement = document.createElement("option");                 // creating option element 
    optionElement.setAttribute("value", itemsArr[i]);
    optionElement.setAttribute("id", itemsArr[i]);
    optionElement.textContent = itemsArr[i];
    roleInput.append(optionElement);
  }
}

function createViewForAdmin(name) {           // function to show message with name
  showMessage(name);                          // calling show message function
}
function createViewForEmployee(name) {
  showMessage(name);
}
function createViewForManager(name) {
  showMessage(name);
}

function showMessage(name) {                              // function to show welcome message                       
  const showMessage = document.querySelector("#text");
  const message = "Welcome" + " " + name;
  showMessage.innerHTML = message;                      // it will show welcome message with name
}

function actionAfterGettingUserDetails(response) {    // response received from getUserDetails api
  const { name, role } = response;
  switch (role) {
    case "admin":
      createViewForAdmin(name);         // show view of admin if role is admin
      break;
    case "employee":
      createViewForEmployee(name);    // show view of employee if role is employee
      break;
    case "manager":
      createViewForManager(name);     // show view of manager if role is manager
      break;
  }
}

// function to create user 
function createUser() {
  const nameInput = document.querySelector('#name')
  const name = nameInput.value;
  const usernameInput = document.querySelector('#username')
  const username = usernameInput.value;
  const roleInput = document.querySelector('#role')
  const role = roleInput.value;
  const password = "";
  fetch(`${baseAddress}/createUser`, {    // api to create user 
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name, username, role, password}),
  }).then(() => {
    console.log("User created successfully")
    getAllUsers();                                                    // called to get details of users without details of user
    showHideCreateNewModal()                                          // called to show create modal 
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

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  console.log(data);

  //if data is empty inside the table
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";
    return;
  }
  let tableHtml = "";

  data.forEach(({ id, name, username, role }, idx) => {
    tableHtml += "<tr>";
    tableHtml += `<td>${idx + 1}</td>`;
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${username}</td>`;
    tableHtml += `<td>${role}</td>`;
    tableHtml += `<td>
      <button onclick=openEditForm(event) 
      data-username=${username} 
      data-name=${name} 
      data-role=${role}
      data-id=${id}>
      Edit</button>
      </td>`;
    tableHtml += `<td>
      <button onclick="deleteUsers(event)"
      data-username=${username}
      data-id=${id}> 
      Delete</button>
      </td>`;
      tableHtml += "</tr>";
  });
  table.innerHTML = tableHtml;
}

function openEditForm(evt) {
  showHideEditNewModal(evt)
  const button = evt.target
  const usernameValue = button.getAttribute('data-username')
  const usernameInput = document.querySelector('#editUsername')
  usernameInput.value = usernameValue
  const nameValue = button.getAttribute('data-name')
  const nameInput = document.querySelector('#editName')
  nameInput.value = nameValue
  const roleValue = button.getAttribute('data-role')
  const roleInput = document.querySelector('#editRole')
  roleInput.value = roleValue
  const idValue = button.getAttribute('data-id')
  const idInput = document.querySelector('#hiddenUserId')
  idInput.value = idValue
}

function getAllUsers() {                                    // function to get details of all users but not admin
  fetch(`${baseAddress}/getAllUsers`, {                     // api to get the details of user
    headers: {
      'Content-type': 'application/json'
    },
  }).then((res) => res.json())
  .then((data) => {
    loadHTMLTable(data);
  })
  .catch(() =>console.log("Something went wrong"));
}

function showHideCreateNewModal() {
  const modal = document.querySelector('#modalCreate')
  const backdrop = document.querySelector('.backdrop-create')
  modal.classList.toggle('d-none')
  backdrop.classList.toggle('d-none')
}


function showHideEditNewModal(event) {
  const editModal = document.querySelector('#editModal')
  const backdrop = document.querySelector('.backdrop-edit')
  editModal.classList.toggle('d-none')
  backdrop.classList.toggle('d-none')
  if(event !== undefined) {
    event.preventDefault()
  }
}

function showHideChangePasswordModal() {
  const changePassword = document.querySelector('#checkPasswordModal')
  const backdrop = document.querySelector('.backdrop-create')
  changePassword.classList.toggle('d-none')
  backdrop.classList.toggle('d-none')
}

function populateEditRolesDropdown(itemsArr) {
  //console.log(itemsArr);
  // itemsArr = [    "admin",    "manager",    "employee"]
  const roleInput = document.querySelector("#editRole");
  for (let i = 0; i < itemsArr.length; i++) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", itemsArr[i]);
    optionElement.setAttribute("id", itemsArr[i]);
    optionElement.textContent = itemsArr[i];
    roleInput.append(optionElement);
  }
}

async function getUserRolesEdit(response) {                            // 
  const {role} = response 
  await fetch(`${baseAddress}/getUserRoles/${role}`)
    .then((res) => res.json())
    .then((response) => {
      populateEditRolesDropdown(response)
    })
    .catch((err) => console.log(err));
}

function updateUser() {
  showHideEditNewModal()
  const nameInput = document.querySelector('#editName')
  const name = nameInput.value;
  const usernameInput = document.querySelector('#editUsername')
  const username = usernameInput.value;
  const roleInput = document.querySelector('#editRole')
  const role = roleInput.value;
  const idInput = document.querySelector('#hiddenUserId')
  const id = idInput.value;
  //console.log("id, name, username, role:::", id, name, username, role)
  fetch(`${baseAddress}/updateUsers`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({id, name, username, role})
  }).then((res) => res.json())
  .then ((data) => {
    console.log(data)
    getAllUsers() })
  .catch(() => console.log("Something went wrong"))
}

function deleteUsers(event) {
  const button = event.target
  const username = button.getAttribute('data-username')
  const id = button.getAttribute('data-id')
  fetch(`${baseAddress}/deleteUsers/username=${username}&id=${id}`, {
    method: 'DELETE',
  }).then((res) => res.json())
  .then ((data) => {
    console.log(data)
    getAllUsers() })
  .catch(() => console.log("Something went wrong"))
}

function checkPasswordChanged() {
  showHideChangePasswordModal()
}

function hideShowSpan(response) {
  const span = document.querySelector('#span')
  const { defaultPasswordChanged } = response
  if (defaultPasswordChanged === 0) {
    span.hidden = false
  }
}






