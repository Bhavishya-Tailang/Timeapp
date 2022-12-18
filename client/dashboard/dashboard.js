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

function checkUserExists() {                                        // function to check if user exist while creating new
  const username = document.querySelector('#username')
  const userExistMessage = document.querySelector('#userExists')
  fetch(`${baseAddress}/checkUserExists/${username.value}`, {      // api to check username exists while creating user
    headers: {
      'Content-type': 'application/json'
    }
  }).then((res) => res.json())
  .then((data) => {
    console.log(data);
    if (data.found) {                                               // if username is found
      userExistMessage.textContent = "user already exists!!"        // it will show message that user exist otherwise username available
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
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";    // if there is no data in table "No Data" is shown
    return;
  }
  let tableHtml = "";                // empty table

  data.forEach(({ id, name, username, role }, idx) => {             // starting loop 
    tableHtml += "<tr>";
    tableHtml += `<td>${idx + 1}</td>`;   // increment the number from 1
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${username}</td>`;
    tableHtml += `<td>${role}</td>`;
    tableHtml += `<td>
      <button onclick=openEditForm(event)   // called to open edit modal
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
    loadHTMLTable(data);                                   // called to get  html table with details of user 
  })
  .catch(() =>console.log("Something went wrong"));
}

function showHideCreateNewModal() {                             // function to show or hide add new modal
  const modal = document.querySelector('#modalCreate')
  const backdrop = document.querySelector('.backdrop-create')
  modal.classList.toggle('d-none')                              // toggle(add or remove) class of modal
  backdrop.classList.toggle('d-none')                           // toggle(add or remove) class of backdrop
}


function showHideEditNewModal(event) {                         // function to show or hide edit modal
  const editModal = document.querySelector('#editModal')
  const backdrop = document.querySelector('.backdrop-edit')
  editModal.classList.toggle('d-none')
  backdrop.classList.toggle('d-none')
  if(event !== undefined) {
    event.preventDefault()                                    // stop event bubbling
  }
}

function showHideChangePasswordModal() {                                  // function to show or hide change password modal
  const changePassword = document.querySelector('#checkPasswordModal')
  const backdrop = document.querySelector('.backdrop-create')
  changePassword.classList.toggle('d-none')
  backdrop.classList.toggle('d-none')
}

function populateEditRolesDropdown(itemsArr) {                          // function to populate roles in edit while updating 
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

async function getUserRolesEdit(response) {                            // response received from getUserDetails api
  const {role} = response 
  await fetch(`${baseAddress}/getUserRoles/${role}`)                  //api to get roles the respective manager/admin can assign while creating any user
    .then((res) => res.json())
    .then((response) => {
      populateEditRolesDropdown(response)                             // called to populate roles
    })
    .catch((err) => console.log(err));
}

function updateUser() {                                                       // function to update user
  showHideEditNewModal()                                                      // called to show or hide edit modal
  const nameInput = document.querySelector('#editName')
  const name = nameInput.value;
  const usernameInput = document.querySelector('#editUsername')
  const username = usernameInput.value;
  const roleInput = document.querySelector('#editRole')
  const role = roleInput.value;
  const idInput = document.querySelector('#hiddenUserId')
  const id = idInput.value;
  //console.log("id, name, username, role:::", id, name, username, role)
  fetch(`${baseAddress}/updateUsers`, {                                      // api to update users
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({id, name, username, role})
  }).then((res) => res.json())
  .then ((data) => {
    console.log(data)
    getAllUsers() })                                                // called to update the html table and get user value
  .catch(() => console.log("Something went wrong"))
}

function deleteUsers(event) {
  const button = event.target
  const username = button.getAttribute('data-username')
  const id = button.getAttribute('data-id')
  fetch(`${baseAddress}/deleteUsers/username=${username}&id=${id}`, {     // api to delete user by setting username and id as variables
    method: 'DELETE',
  }).then((res) => res.json())
  .then ((data) => {
    console.log(data)
    getAllUsers() })                                          // called to update the html table and get user value
  .catch(() => console.log("Something went wrong"))
}

function checkPasswordChanged() {
  showHideChangePasswordModal()                                   // called to show or hide password modal 
}

function hideShowSpan(response) {                 // response received from getUserDetails api
  const span = document.querySelector('#span')
  const { defaultPasswordChanged } = response
  if (defaultPasswordChanged === 0) {           // condition to show change password message
    span.hidden = false
  }
}