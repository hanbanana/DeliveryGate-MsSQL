var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var sql = require("mssql");

// config for your database
var config = {
  user: 'sa',
  password: '##PowerEdge',
  server: 'gpt-db3',
  database: 'TransNet'
};

app.get('/', function (req, res) {

  // connect to your database
  sql.connect(config, function (err) {

    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('select * from HrxGateDeliveryOrder', function (err, recordset) {

      if (err) console.log(err)

      // send records as a response
      res.render("index", { HrxGateDeliveryOrder: recordset });
      // res.send(data)
      sql.close();

    });
  });
});

app.get("/create", function (req, res) {
  request.query("SELECT * FROM HrxGateDeliveryOrder;", function (err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("create", { HrxGateDeliveryOrder: data });
  });
});

app.get("/order/:id", function (req, res) {
  request.query("SELECT * FROM HrxGateDeliveryOrder where id = ?", [req.params.id], function (err, data) {
    if (err) {
      return res.status(500).end();
    }

    console.log(data);
    res.render("edit", data[0]);
  });
});

app.get('/customer', function (req, res) {

  // connect to your database
  sql.connect(config, function (err) {

    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('select * from HrxGateDeliveryOrder', function (err, data) {

      if (err) console.log(err)

      // send records as a response
      res.render("customer", { HrxGateDeliveryOrder: data });
      // res.send(data)
      sql.close();

    });
  });
});

app.get("/contact", function (req, res) {

    res.render("contact");
  
});

// Create a new todo
app.post("/todos", function (req, res) {
  request.query("INSERT INTO HrxGateDeliveryOrder (BL, Terminal_Name, Container_No, Vassel_No, ETA, Weight, Seal_No, Delivery_Location, Status_, Return_, Close_) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [req.body.BL, req.body.Terminal_Name, req.body.Container_No, req.body.Vassel_No, req.body.ETA, req.body.Weight, req.body.Seal_No, req.body.Delivery_Location, req.body.Status_, req.body.Return_, req.body.Close_], function (err, result) {
      if (err) {
        return res.status(500).end();
      }

      // Send back the ID of the new todo
      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    });
});

// Retrieve all todos
app.get("/todos", function (req, res) {
  request.query("SELECT * FROM HrxGateDeliveryOrder;", function (err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});

// Update a todo
app.put("/todos/:id", function (req, res) {
  request.query("UPDATE HrxGateDeliveryOrder SET BL = ?, Terminal_Name = ?, Container_No = ?, Vassel_No = ?, ETA = ?, Weight = ?, Seal_No = ?, Delivery_Location = ?, Status_ = ?, Return_ = ?, Close_ = ? WHERE id = ?",
  [req.body.BL, req.body.Terminal_Name, req.body.Container_No, req.body.Vassel_No, req.body.ETA, req.body.Weight, req.body.Seal_No, req.body.Delivery_Location, req.body.Status_, req.body.Return_, req.body.Close_, req.params.id],
    function (err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();

    });
});

// Delete a todo
app.delete("/todos/:id", function (req, res) {
  request.query("DELETE FROM HrxGateDeliveryOrder WHERE id = ?", [req.params.id], function (err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();

  });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
