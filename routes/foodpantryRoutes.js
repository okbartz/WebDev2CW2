const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodpantryControllers.js');

const {login} = require('../auth/auth.js');
const {verify} = require('../auth/auth.js');
const {verifyAdmin} = require('../auth/auth.js');
// router.get('/new', verify, controller.show_new_entries);
router.post('/login', login,controller.handle_login);



router.get("/", controller.show_about_page);

router.get('/foodpantry', controller.entries_list);
router.get('/viewOwnPantry', controller.view_own_pantry);


//CONTACT ROUTES
router.get('/contact', controller.new_message);
router.post('/contact', controller.post_new_message);


//ENTRIES ROUTES
router.get('/new',verify, controller.new_entries);
router.post('/new',verify, controller.post_new_entry);

//ADMIN FUNCTION ROUTES
router.get('/deleteUser/:userid',verifyAdmin, controller.post_delete_user);
router.get('/deleteAdmin/:userid',verifyAdmin, controller.post_delete_admin);
router.get('/deletePost/:postid',verifyAdmin, controller.post_delete_posts);
router.get('/deleteMessage/:_id',verifyAdmin, controller.post_delete_message);
router.get('/deletePantry/:_id',verifyAdmin, controller.post_delete_pantry);




router.post('/editUser',verifyAdmin, controller.update_user);
router.post('/editAdmin',verifyAdmin, controller.update_admin);
router.post('/editPantry',verifyAdmin, controller.update_pantry);


router.get('/admin',verifyAdmin, controller.show_admin_page);
router.get('/adminPanelUser',verifyAdmin, controller.show_admin_users);
router.get('/adminPanelPosts',verifyAdmin, controller.show_admin_posts);
router.get('/adminPanelMessages',verifyAdmin, controller.show_messages);
router.get('/adminPanelAdmin',verifyAdmin, controller.show_admin_admins);
router.get('/adminPanelPantry',verifyAdmin, controller.show_admin_pantry);

router.get('/addNewAdmin',verifyAdmin, controller.show_addAdmin);
router.post('/addNewAdmin',verifyAdmin, controller.post_addAdmin);

router.get('/addNewPantry',verifyAdmin, controller.show_addPantry);
router.post('/addNewPantry',verifyAdmin, controller.post_addPantry);

router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get('/login', controller.show_login_page);
router.get("/logout",verify, controller.logout);
router.get("/loggedIn",verify, controller.loggedIn_landing);

router.get("/about", controller.show_about_page);

router.get('/changePantry/:itemID',verify, controller.update_itempantry);

// router.get('/about', function (req, res) {
//     res.redirect('/about.html');
// })

router.get('/posts/:userid',verify, controller.show_user_entries);

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