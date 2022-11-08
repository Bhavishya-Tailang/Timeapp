const express = require("express");
const app = express();
const dbService = require("./dbService");
const encryptDecryptData = require("./util");
const cors = require("cors");
const { response } = require("express");
const { keyIn } = require("readline-sync");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/createUser", (req, res) => {
  const operation = "encrypt";
  const { name, username, role, password } = req.body;
  if (username !== "" && username !== null && username !== undefined) {
    const db = dbService.getInstance();
    const pwdKeyObj = encryptDecryptData(operation, password);
    const result = db.createUser(
      name,
      username,
      role,
      pwdKeyObj.encryptionKey,
      pwdKeyObj.password
    );

    result
      .then((data) => res.json({ data: data }))
      .catch((err) => console.error(err));
  } else {
    return res.status(400).send({ message: "request body incorrect" });
  }
});

//check login
app.post("/checkLogin", (req, res) => {
  const { username, role, password } = req.body;
  const operation = "decrypt";
  const db = dbService.getInstance();
  db.checkLogin(username, role, password)
  .then((data) => {
    console.log(data);
    if (
      username === data[0]?.username &&
      role === data[0]?.role &&
      password ===
        encryptDecryptData(operation, data[0]?.password, data[0]?.encryptionKey)
    ) {
      return res.status(200).send({ status: 200, message: "login successful" });
    } else {
      const err = new Error("wrong credentials");
      err.status = 401;
      return res.status(403).send({ message: "wrong credentials" });
    }
  });
});

// get role
app.get("/getUserDetails/:username", (req, res) => {
  const { username } = req.params;
  const db = dbService.getInstance();
  db.getUserDetails(username)
    .then((data) => res.json(data[0]))
    .catch((err) => console.log(err));
});

// getting role according to login
app.get("/getUserRoles/:role?", (req, res) => {
  const { role } = req.params;
  switch (role) {
    case undefined:
      return res.json(["admin", "manager", "employee"]);
    case "admin":
      return res.json(["manager", "employee"]);
    case "manager":
      return res.json(["employee"]);
    default:
      return res.json([]);
  }
});

//check duplicate users
app.get("/checkUserExists/:username", (req, res) => {
  const { username } = req.params;
  const db = dbService.getInstance();
  db.checkUserExists(username)
    .then((data) => {
        console.log(data, data.length);
        if(data.length > 0) {
            return res.json({found: true});
        }
        return res.json({found: false});
    })
    .catch((err) => console.log(err));
});

//getting all users
app.get("/getAllUsers", (req, res) => {
    const db= dbService.getInstance();
    db.getAllUsers()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
})

app.listen("3000", () => {
  console.log("App is running");
});

//update users
app.patch('/updateUsers', (req, res) => {
  const {name, username, role} = req.body;
  const db = dbService.getInstance();

  const result = db.updateUsers(name, username, role);  

  result 
  .then(data => res.json({success: "record updated successfully"}))
  .catch(err => console.log(err)) 
});

//delete users with update query
app.delete('/deleteUsers/:username', (req, res) => {
  const {username} = req.params;
  console.log(req.body);
  const db = dbService.getInstance();
  const result = db.deleteUsers(username);  
  result 
  .then(() => res.json({success: "record deleted successfully"}))
  .catch(err => console.log(err)) 
});
