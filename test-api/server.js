require("dotenv").config();
const express =require('express');
const cors = require('cors');
const morgan = require('morgan');
 
const apiEmployeeRouter = require('./apiEmployeesRouter');
const apiAirportsRouter = require('./apiAirportsRouter');

const app = express();
const PORT= process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(cors());
app.use(morgan('dev'));

app.use('/employees', apiEmployeeRouter);
app.use('/airports', apiAirportsRouter);

app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
});

module.exports = app;