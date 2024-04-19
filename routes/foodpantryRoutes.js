const express = require('express');
const router = express.Router();

const controllerAdmin = require('../controllers/AdminController.js');
const controllerUser = require('../controllers/UserController.js');
const controller = require('../controllers/foodpantryControllers.js');

const {login} = require('../auth/auth.js');
const {verify} = require('../auth/auth.js');
const {verifyAdmin} = require('../auth/auth.js');
// router.get('/new', verify, controller.show_new_entries);



//ABOUT PAGE ROUTES
router.get("/", controller.show_about_page);
router.get("/about", controller.show_about_page);

//PANTRY ROUTES
// router.get('/foodpantry', controller.entries_list);
router.get('/viewOwnPantry', controller.view_own_pantry);
router.get('/changePantry/:itemID',verify, controller.update_itempantry);

//CONTACT ROUTES
router.get('/contact', controller.new_message);
router.post('/contact', controller.post_new_message);


//ENTRIES ROUTES
router.get('/new',verify, controller.new_entries);
router.post('/new',verify, controller.post_new_entry);
router.get('/posts/:userid',verify, controller.show_user_entries);

//ADMIN FUNCTION ROUTES

    //DELETE ROUTES
    router.get('/deleteUser/:userid',verifyAdmin, controllerAdmin.post_delete_user);
    router.get('/deleteAdmin/:userid',verifyAdmin, controllerAdmin.post_delete_admin);
    router.get('/deletePost/:postid',verifyAdmin, controllerAdmin.post_delete_posts);
    router.get('/deleteMessage/:_id',verifyAdmin, controllerAdmin.post_delete_message);
    router.get('/deletePantry/:_id',verifyAdmin, controllerAdmin.post_delete_pantry);



    //EDIT ROUTES
    router.post('/editUser',verifyAdmin, controllerAdmin.update_user);
    router.post('/editAdmin',verifyAdmin, controllerAdmin.update_admin);
    router.post('/editPantry',verifyAdmin, controllerAdmin.update_pantry);

    router.get('/getUserDetails/:userid',verifyAdmin, controllerAdmin.get_user_details);
    router.get('/getAdminDetails/:userid',verifyAdmin, controllerAdmin.get_admin_details);
    router.get('/getPantryDetails/:pantryid',verifyAdmin, controllerAdmin.get_pantry_details);


    //ADMIN PANEL ROUTES
    router.get('/admin',verifyAdmin, controllerAdmin.show_admin_page);
    router.get('/adminPanelUser',verifyAdmin, controllerAdmin.show_admin_users);
    router.get('/adminPanelPosts',verifyAdmin, controllerAdmin.show_admin_posts);
    router.get('/adminPanelMessages',verifyAdmin, controllerAdmin.show_messages);
    router.get('/adminPanelAdmin',verifyAdmin, controllerAdmin.show_admin_admins);
    router.get('/adminPanelPantry',verifyAdmin, controllerAdmin.show_admin_pantry);

    //ADD ROUTES
    router.get('/addNewAdmin',verifyAdmin, controllerAdmin.show_addAdmin);
    router.post('/addNewAdmin',verifyAdmin, controllerAdmin.post_addAdmin);

    router.get('/addNewPantry',verifyAdmin, controllerAdmin.show_addPantry);
    router.post('/addNewPantry',verifyAdmin, controllerAdmin.post_addPantry);

//LOGIN AND REGISTRATION ROUTES
    router.get('/register', controllerUser.show_register_page);
    router.post('/register', controllerUser.post_new_user);
    router.get('/login', controllerUser.show_login_page);
    router.post('/login', login,controllerUser.handle_login);
    router.get("/logout",verify, controllerUser.logout);
    router.get("/loggedIn",verify, controllerUser.loggedIn_landing);


router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;