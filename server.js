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
const { audioBookRouter } = require('./routes/audioBookRouter');
const { newsRouter } = require('./routes/newsRouter');
const { commentRouter } = require('./routes/commentRouter');
const { cardRouter } = require('./routes/cardRouter');
const { discountRouter } = require('./routes/discountRouter');



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
app.use('/api/audioBook', audioBookRouter);
app.use('/api/news', checkUser, newsRouter);
app.use('/api/comment', commentRouter);
app.use('/api/card', checkUser, cardRouter);
app.use('/api/discount', checkUser, discountRouter);

app.use('/api/files', fileRouter);


// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.use('/', express.static("./public"));
// app.get("/", express.static(path.join(__dirname, "./public")));
// or using middilware app.use(express.static('public'));

app.use(express.static('routes'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('API Not Found. Please check it and try again.');
    err.status = 404;
    next(err);
});

// Error handle
app.use(function(err, req, res, next) {
    console.log("[Global error middleware]", err.message);
    res.status(err.status || 500).send({
        message: err.message
    })
    next();
})

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on", PORT);
    connectDb();
});