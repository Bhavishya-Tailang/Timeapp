tasks to be done:
    1. login
        Table creation: DONE
            userDetails (id, name, userName, role, date, delete)
            encryptionKeyDetails (id, userName, encryptionKey, date, delete)
            userCredentialDetails (id, encryptionKey, password, date, delete)
        Api:
            createUser (post api - body {name, userName, password, role}): DONE
            checkLogin: DONE
            updateUser
            changeRole
            deleteUser
            getUserById
        UI:
            login screen design: DONE
            login screen functionality: Partially DOne
                login button functionality wiring - perform login operation
                redirection to homepage with a delay with successful message - if login is successful - done
                error message -if login fails - done

DOne:
    show messages for error/successful
    change index.js -> login.js: Done
    create separate folders for login |-> login.html/login.js, dashboard |-> dashboard.html/dashobard.js: Done
    create api for getRole - GET API |-> for which user to get role???
    called on domContentLoaded on dashboard
    create 3 functions in dashboard js
        createViewForAdmin | this is dashbard for admin
        createViewForEmployee | this is dashbard for admin
        createViewForManager | this is dashbard for admin


2.  dashboard
        table creation: tasksDetail
        id, date, delete, username, managerId, projectCode, projectName, rating, enteredTime, employeeRemarks, managerRemarks, status
        tasks:
            manager will add an employee - createUser - DOne
            manager will be creating a project and assign to an employee and time required - createTask - post
            employee will add time to the assigned projects and add remarks accordingly - updateTaskByEmployee - put
            manager will check the time entered and remarks and provide the ratings and remarks - updateTaskByManager - put
            employee and manager can change the status accordingly - updateTaskByEmployee/updateTaskByManager

            admin will add the manager - createUser - DOne
            list of managers and their employees will be shown to admin - getAllUsers - get - current task - not admin
            UI to add an employee/manager - common for admin and manager
            while adding new manager/employee - default password will be used - pass123
            prompt will appear to change password first time - updateUserDetails - put

        Put validations
            UI:
                clear out inputs
                clear out variables
                disable/enable submit button - to be done
            BE:
                check for empty dataset: return false and do not create a user - done
                create an api to check for duplicate user - get api - focusout event - checkUserExists - return true -cross/false - tick - done

                select 1 from userdetails where username = ? - Done
                [1] []

        Create relationship table - employeeRelations
        id, date, delete, username, managerId, projectCode
ram - saurabh
shyam - saruabh
raju- saurabh
hira - ramesh
kamal - ramesh