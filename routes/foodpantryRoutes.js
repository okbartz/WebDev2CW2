const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodpantryControllers.js');

const {login} = require('../auth/auth.js');
const {verify} = require('../auth/auth.js');
const {verifyAdmin} = require('../auth/auth.js');
router.get('/new', verify, controller.show_new_entries);
router.post('/login', login,controller.handle_login);



router.get("/", controller.show_about_page);

router.get('/foodpantry', controller.entries_list);


// router.get('/new', controller.new_entry);

router.get('/new', controller.new_entries);
router.post('/new', controller.post_new_entry);
router.get('/deleteUser/:userid', controller.post_delete_user);
router.get('/deletePost/:postid', controller.post_delete_posts);

router.get('/peter', controller.peters_entries);
router.get('/admin',verifyAdmin, controller.show_admin_page);
router.get('/adminPanelUser',verifyAdmin, controller.show_admin_users);
router.get('/adminPanelPosts',verifyAdmin, controller.show_admin_posts);
router.get('/adminPanelAdmin',verifyAdmin, controller.show_admin_admins);
router.get('/adminPanelPantry',verifyAdmin, controller.show_admin_users);


router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get('/login', controller.show_login_page);
router.get("/logout",verify, controller.logout);
router.get("/loggedIn",verify, controller.loggedIn_landing);

router.get("/about", controller.show_about_page);

// router.get('/about', function (req, res) {
//     res.redirect('/about.html');
// })

router.get('/posts/:userid', controller.show_user_entries);

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