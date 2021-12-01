// Requiring module
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');
const upload = require('express-fileupload')

const { connectDb } = require("./services/db/db");
const { checkUser } = require("./middlewares/authMiddleware")
const { checkPermission, isAdmin } = require('./middlewares/checkPermission');


const { userRouter } = require("./routes/userRouter");
const { bookRouter } = require('./routes/bookRouter');
const { fileRouter } = require('./routes/fileRouter');



app.use(cors());
require("dotenv").config();
// parse multipart/form data
// app.use(upload());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))
// // if json come backend then it convert to obj in req.body
// parse application/json
app.use(express.json({extended: true, limit: '50mb'})) 



app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);
app.use('/api/files', fileRouter);


// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.use('/', express.static("./public"));
// app.get("/", express.static(path.join(__dirname, "./public")));
// or using middilware app.use(express.static('public'));

// Error handle
app.use(function(err, req, res, next) {
    console.log("[Global error middleware]", err.message);
    res.status(500).send({
        message: err.message
    })
    next();
})

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on", PORT);
    connectDb();
});