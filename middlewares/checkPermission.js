
/* rules of users
    admin
    user
*/
function checkPermission(req, res, next) {
    const {role} = req.user;
    // console.log(role)
    if (role == 'admin') {
    } else if (role == 'user') {
    } else {
        res.send({ message: "You can not access here" })
    }
    // console.log(req.baseUrl);
    
    next()
}
function isAdmin(req, res, next) {
    const {role} = req.user;
    // console.log(role)
    if (role == 'admin') {
    } else {
        res.send({ message: "You can not access here" })
    }    
    next()
}
module.exports = {
    checkPermission,
    isAdmin
}