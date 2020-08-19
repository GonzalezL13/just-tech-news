const router = require("express").Router();
const { User } = require("../../models");

//GET /api/users
router.get("/", (req, res) => {
    //Access our User model and run .findAll() method)
    //Equivilent to SELECT * FROM users;
    User.findAll({
        //wont show password
        attributes: { exclude: ['password'] }
    })
        //will show all users
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//GET /api/users/1
router.get("/:id", (req, res) => {
    //Equivilent to SELECT * FROM users WHERE id = 1
    //by using findOne() and where: id: req.params.id
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            //if nonexistent id then 404 status then return
            if (!dbUserData) {
                res.status(404).json({ message: "NO user found with this id" });
                return;
            }
            //if id exist
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//POST /api/users
//to create a user
//the User.create is equivilent to 
// INSERT INTO user
//   (username, email, passowrd)
// VALUES
//   ("Lernan", "lenar@gmail.com", "pass123");
router.post("/", (req, res) => {
    // expects {username: "lernan", email: "lenar@fake.com", password: "pass123"}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//PUT /api/users/1
//to update a user
//User.update equivilent to 
//UPDATE users
//SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
//WHERE id = 1;
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    //We pass in req.body to provide the new data we want to use in the update
    User.update(req.body, {
        individualHooks: true,
        where: {
            //req.params.id to indicate where exactly we want that new data to be used
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// DELETE /api/users/1
//Delete user from database
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
