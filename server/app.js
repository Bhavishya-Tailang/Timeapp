const express = require("express");
const app = express();
const dbService = require("./dbService");
const encryptDecryptData = require("./util");
const cors = require("cors");
const { response } = require("express");
const { keyIn } = require("readline-sync");
const Dbservice = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/createUser", (req, res) => {
  const operation = "encrypt";
  const { name, username, role } = req.body;                                // getting key values
  let password = "pass123"
  const defaultPasswordChanged = 0;
  if (username !== "" && username !== null && username !== undefined) {
    const db = dbService.getInstance();
    const pwdKeyObj = encryptDecryptData(operation, password);
    const result = db.createUser(                                           // data that will be sent back
      name,
      username,
      role,
      pwdKeyObj.encryptionKey,
      pwdKeyObj.password,
      defaultPasswordChanged
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
      username === data[0]?.username &&                                               // checking in input and database if values match
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
app.get("/getUserDetails/:username", (req, res) => {      // api to get details of users  like name, role, username, defaultPasswordChanged
  const { username } = req.params;
  const db = dbService.getInstance();
  db.getUserDetails(username)
    .then((data) => res.json(data[0]))
    .catch((err) => console.log(err));
});

// getting role according to login
app.get("/getUserRoles/:role?", (req, res) => {              // api to get role on different cases when user login 
  const { role } = req.params;
  switch (role) {                                           // different cases to show roles in dropdown
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
app.get("/checkUserExists/:username", (req, res) => {             // api to check username if exist
  const { username } = req.params;
  const db = dbService.getInstance();
  db.checkUserExists(username)
    .then((data) => {
        //console.log(data, data.length);
        if(data.length > 0) {                         // condition to check if length of data is greater than 0
            return res.json({found: true});           // if true response will be true otherwise false
        }
        return res.json({found: false});
    })
    .catch((err) => console.log(err));
});

//getting all users
app.get("/getAllUsers", (req, res) => {         // api to get manager and employee details 
    const db= dbService.getInstance();
    db.getAllUsers()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
})


//update users
app.patch('/updateUsers', (req, res) => {                                 // api to update details of user on the basis of id and username
  const {id, name, username, role} = req.body;
  console.log(req.body)
  const db = dbService.getInstance();
  
  const result = db.updateUsers(id, name, username, role);  
  console.log("id, name, username, role:::", id, name, username, role)
  console.log(result)
  result 
  .then(data => res.json({success:data}))
  .catch(err => console.log(err)) 
});

//delete users 
app.delete('/deleteUsers/username=:username&id=:id', (req, res) => {
  const {username, id} = req.params;
  console.log(req.body);
  const db = dbService.getInstance();
  db.getEncryptKey(username)
  .then((encryptionKeyData) => {
    const result = db.deleteUsers(username, id, encryptionKeyData[0]?.encryptionKey); 
    return result.then((data) => res.json({deleted: data}))
    .catch(err => console.log(err)) 
  }).catch(err => console.log(err)) 
  
});

app.patch('/changePassword',( req, res) => {
  console.log(req.body)
  const {oldPassword, newPassword, username} = req.body
  const operation = 'decrypt'
  const db = dbService.getInstance()
  db.getEncryptKey(username)
  .then((encryptionKey) => {
    const result = db.getPassword(encryptionKey[0]?.encryptionKey)
    result.then(encryptedPssword => {
      const decryptedPassword = encryptDecryptData(operation, encryptedPssword[0].password, encryptionKey[0]?.encryptionKey)
      console.log("decryptedPassword:::", decryptedPassword)
      console.log("encryptDecryptData::: ", encryptedPssword)
    })
  })

}) 

app.listen("3000", () => {
  console.log("App is running");
});