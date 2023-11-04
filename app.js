// Import required modules and set up Express.
var express = require('express');
var path = require('path');
var app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// Define the port where the Express app will listen. Default to 3000 if the environment variable 'port' is not set.
const port = process.env.port || 3000;

// Serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// Configure the Express Handlebars engine.
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        // Custom Handlebars helper functions.
        replaceZero: function (num) {
            if (num === 0) {
                return 'zero';
            } else {
                return num;
            }
        },
        highlightIfZero: function (value) {
            return value === 0 ? 'highlight' : '';
        }
    },
    defaultLayout: 'main'
}));

// Set the view engine to 'hbs'.
app.set('view engine', 'hbs');

// You can start defining your routes and route handlers below this point.

// Set the view engine to 'hbs' for Handlebars templates.
app.set('view engine', 'hbs');

// Configure the URL-encoded body parser for parsing form data.
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Define a route for the root URL ('/').
app.get('/', function (req, res) {
  // Render the 'index' view and provide a title to the template.
  res.render('index', { title: 'Express' });
});

// Define a route for '/users'.
app.get('/users', function (req, res) {
  // Respond with a simple text message.
  res.send('respond with a resource');
});

// Define a route for '/searchByindex'.
app.get('/searchByindex', function (req, res) {
  // Render the 'searchWithIndex' view and provide a title to the template.
  res.render('searchWithIndex', { title: 'Search the InvoiceID By Index' });
});

app.get('/alldata/invoiceID/:index', (req, res) => {
    const index = parseInt(req.params.index);

    // Check if the parsed index is NaN.
    if (isNaN(index)) {
        //Responding with error status and message
        res.status(400).render('searchWithIndex', { error: 'The Index must be a number' });
        return;
    }
    // Read the JSON file asynchronously
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        // If any error occurs while reading the file, response
        if (err) {
            //log the error
            console.error(err);
            res.status(500).send('Error loading JSON data');
        } else {
            //When the the data load is succeses full
            console.log('JSON data is loaded');

            try {
                //parse data into json
                const jsonData = JSON.parse(data);
                //Check whether the index is greater than zero and less than the length of the array
                if (index >= 0 && index < jsonData.length) {
                    //Get the selected car details
                    const invoiceNo = jsonData[index].Invoice_ID;
                    res.render('searchWithIndex', { title: 'Search the InvoiceID By Index', description: "INVOICE NUMBER : ", content: invoiceNo });
                } else {
                    //sent the error log when the invoice not found
                    res.render('searchWithIndex', { title: 'Search the InvoiceID By Index', error: 'The Index not found' });
                }
            } catch (err) {
                //sent the error log when the invoice not found
                console.error(err);
                res.status(500).send('Error parsing JSON data');
            }
        }
    });
});

app.get('/search/invoiceID/', function (req, res) {
    res.render('searchWithInvoice', { title: 'Search the details Invoice Number' });
});


app.post('/search/invoiceID/', urlencodedParser, (req, res) => {
    const invoiceNoToSearch = req.body.invoiceNo;
    // Read the JSON file asynchronously
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        // If any error occurs while reading the file, response
        if (err) {
            //log the error
            res.status(500).send('Error loading JSON data');
        } else {
            //parsing the data into json 
            const jsonData = JSON.parse(data);
            //Checking the given condition and storng the value to the variable
            const foundData = jsonData.find(item => item.Invoice_ID === invoiceNoToSearch);

            if (foundData) {

                console.log(foundData)
                //when data is fount sending the html data to the reponse
                res.render('searchWithInvoice', { title: 'Search the details Invoice Number', foundData: foundData });

            } else {
                res.render('searchWithInvoice', { title: 'Search the details Invoice Number', error: 'Invoice Not found' });
            }
        }
    });

});

app.get('/search/produceLine/', function (req, res) {
    res.render('searchWithproduceLine', { title: 'Search the  details By Produce Line' });
});


app.post('/search/produceLine/', urlencodedParser, (req, res) => {
    const manufacturerToSearch = req.body.produceLine;
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        //If found and error during reading the file
        if (err) {
            //log the error
            res.status(500).send('Error loading JSON data');
        } else {
            // parsing the data to json
            const jsonData = JSON.parse(data);
            //looping through the data and check wether the manufacturer name is present using includes method.
            const foundData = jsonData.filter(item => item.Product_line.toLowerCase().includes(manufacturerToSearch.toLowerCase())).slice(0, 3);
            console.log(foundData)
            if (foundData == []) {
                console.log("no data")
                res.render('searchWithproduceLine', { title: 'Search the car details By Manufacturer', error: "No such manufacturer exists" });
            } else {
                console.log("yes data")
                res.render('searchWithproduceLine', { title: 'Search the car details By Manufacturer', foundDatas: foundData, error: foundData ? "" : "No such manufacturer exists" });

            }
        }
    });
});

app.get('/viewData', function (req, res) {

    // Read the JSON file asynchronously
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        // If any error occurs while reading the file, response
        if (err) {
            //log the error
            res.status(500).send('Error loading JSON data');
        } else {
            //parsing the data into json 
            const jsonData = JSON.parse(data);
            //Checking the given condition and storng the value to the variable
            const foundData = jsonData

            if (foundData) {

                console.log(foundData)
                //when data is fount sending the html data to the reponse
                res.render('viewData', { foundData: foundData });

            }
        }
    });

});

app.get('/allData', function (req, res) {

    // Read the JSON file asynchronously
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        // If any error occurs while reading the file, response
        if (err) {
            //log the error
            res.status(500).send('Error loading JSON data');
        } else {
            //parsing the data into json 
            const jsonData = JSON.parse(data);
            //Checking the given condition and storng the value to the variable
            const foundData = jsonData

            if (foundData) {

                console.log(foundData)
                //when data is fount sending the html data to the reponse
                res.render('allData', { Content: "Well Done The Jason Data is loaded successfully" });

            }
        }
    });

});


app.get('/viewName', function (req, res) {

    // Read the JSON file asynchronously
    fs.readFile('SuperSales.json', 'utf8', (err, data) => {
        // If any error occurs while reading the file, response
        if (err) {
            //log the error
            res.status(500).send('Error loading JSON data');
        } else {
            //parsing the data into json 
            const jsonData = JSON.parse(data);
            //Checking the given condition and storng the value to the variable
            const foundData = jsonData

            if (foundData) {

                console.log(foundData)
                //when data is fount sending the html data to the reponse
                res.render('viewName', { foundData: foundData });

            }
        }
    });

});

// Define a catch-all route that handles any routes that are not explicitly defined earlier.
app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

// Start the Express app and listen on the specified port.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _George devid john______ Student ID: _no1547325_______ Date: __November 3_________
*
*
******************************************************************************
**/ 