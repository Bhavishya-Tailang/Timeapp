let instance = null;

const baseAddress = 'http://localhost:3000'

class DashboardServices {
   static getInstance() {
      return instance ? instance : new getServices();
   }

   //create user
   /**
    * @function createUser - api to create a new user { name, username, role, password }
    * @param { string } name - used to store name in name input 
    * @param { string } username - used to store username in username input
    * @param { string }role - used to store role in role input
    * @param { string } password - used to store password string
    */
   createUser$(name, username, role, password) {
      return fetch(`${baseAddress}/createUser`, {    // api to create user 
         headers: {
           'Content-type': 'application/json'
         },
         method: 'POST',
         body: JSON.stringify({name, username, role, password}),
       })
   }

   /**
    * @function getUserDetails - api to get details of user { name, role, username, defaultPasswordChanged }
    * @param {string} username - username for which user details will be fetched
    */
   getUserDetails$(username) {
      return fetch(`${baseAddress}/getUserDetails/${username}`) 
      .then((res) => res.json())
   }

   /**
    * @function getUserRoles - api to get roles the respective manager/admin can assign while creating any user
    * @param { string } role - getting roles from response and response from getUserDetails api
    */
   getUserRoles$(role) {
      return fetch(`${baseAddress}/getUserRoles/${role}`)    //api to get roles the respective manager/admin can assign while creating any user
      .then((res) => res.json())
   }

   /**
    * 
    */
   checkUserExists$(username) {
      return fetch(`${baseAddress}/checkUserExists/${username.value}`, {      // api to check username exists while creating user
         headers: {
           'Content-type': 'application/json'
         }
       }).then((res) => res.json())
   }
}