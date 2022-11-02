document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  fetch(`http://localhost:3000/getUserDetails/${username}`)
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
    await fetch(`http://localhost:3000/getUserRoles/${role}`)
      .then((res) => res.json())
      .then((response) => {
        populateRolesDropdown(response)
      })
      .catch((err) => console.log(err));
}

function populateRolesDropdown(itemsArr) {
  console.log(itemsArr);
  // itemsArr = [    "admin",    "manager",    "employee"]
  const roleInput = document.querySelector("#roleForDashboard");
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
