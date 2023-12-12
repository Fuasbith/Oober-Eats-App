const http = require('http');
const fs = require('fs');
const express = require("express");   /* Accessing express module */
const path = require("path");
const bodyParser = require("body-parser"); /* To handle post parameters */


require("dotenv").config({ path: path.resolve(__dirname, 'lookInside/.env') })  
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_CONNECTION_STRING;

/* Our database and collection */
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};

const app = express();  /* app is a request handler function */

/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended:false}));

// Check the number of command line arguments
if (process.argv.length !== 3) {
    console.log('Usage: node foodDeliveryServer.js portNumber');
    process.exit(1); // Exit the process with a non-zero code to indicate an error
}

const portNumber = process.argv[2];
const httpSuccessStatus = 200;

// this is for the static images. food.jpg
app.use(express.static(path.join(__dirname, 'public')));

/* necessary or the webpage won't actually show up*/
app.listen(portNumber); 

console.log(`Web server started and running at http://localhost:${portNumber}`);

process.stdout.write("Stop to shutdown the server: ");
process.stdin.setEncoding("utf8"); /* encoding */
process.stdin.on('readable', () => {  /* on equivalent to addEventListener */
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
		let command = dataInput.trim();
		if (command.toLowerCase() === "stop") {
			console.log("Shutting down the server");
            process.exit(0);  /* exiting */
        } else {
			/* After invalid command, try again */
			console.log(`Invalid command: ${command}`);
            process.stdout.write("Stop to shutdown the server: ");
            process.stdin.resume(); /* resets the thing and keeps it going. basically a while loop */
		}
    }
});

/* directory where templates will reside */
app.set("views", path.resolve(__dirname, "templates"));

/* view/templating engine */
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    /* Generating the HTML using welcome template */
    response.render("homepage");
});

app.get("/order", (request, response) => {
    /* Generating the HTML using welcome template */
    response.render("orderForm.ejs");
});

app.post("/order", async (request, response) => {
    // Retrieve form data from the request body
    const { name, email, address, breakfast, breakfastWater, breakfastSoda, breakfastMilk, breakfastTea, breakfastJuice,
        breakfastYogurt,breakfastFries,breakfastTears,breakfastFruit,breakfastVeggies, lunch, lunchWater, lunchSoda, lunchMilk, lunchTea, lunchJuice,
        lunchWedges, lunchFries, lunchPotatoes, lunchFruit, lunchVeggies, dinner, dinnerWater, dinnerSoda, dinnerMilk, dinnerTea, dinnerJuice, dinnerWedges, dinnerFries, dinnerPotatoes, dinnerFruit,
        dinnerVeggies } = request.body;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    const database = client.db(databaseAndCollection.db);
    const collection = database.collection(databaseAndCollection.collection);

    // Create a new document for the application data
    const newApplication = {
        name: name,
        email: email,
        address: address,
        breakfast: breakfast,
        breakfastWater: breakfastWater,
        breakfastSoda: breakfastSoda,
        breakfastMilk: breakfastMilk,
        breakfastTea: breakfastTea,
        breakfastJuice: breakfastJuice,
        breakfastYogurt: breakfastYogurt,
        breakfastFries: breakfastFries,
        breakfastTears: breakfastTears,
        breakfastFruit: breakfastFruit,
        breakfastVeggies: breakfastVeggies,
        lunch: lunch,
        lunchWater: lunchWater,
        lunchSoda: lunchSoda,
        lunchMilk: lunchMilk,
        lunchTea: lunchTea,
        lunchJuice: lunchJuice,
        lunchWedges: lunchWedges,
        lunchFries: lunchFries,
        lunchPotatoes: lunchPotatoes,
        lunchFruit: lunchFruit,
        lunchVeggies: lunchVeggies,
        dinner: dinner,
        dinnerWater: dinnerWater,
        dinnerSoda: dinnerSoda,
        dinnerMilk: dinnerMilk,
        dinnerTea: dinnerTea,
        dinnerJuice: dinnerJuice,
        dinnerWedges: dinnerWedges,
        dinnerFries: dinnerFries,
        dinnerPotatoes: dinnerPotatoes,
        dinnerFruit: dinnerFruit,
        dinnerVeggies: dinnerVeggies
    };
    

    try {
        await client.connect();
        // Insert the new application document into the collection
        await collection.insertOne(newApplication);

        response.render("orderData.ejs", {
            name: name,
            email: email,
            address: address,
            breakfast: breakfast,
            breakfastWater: breakfastWater,
            breakfastSoda: breakfastSoda,
            breakfastMilk: breakfastMilk,
            breakfastTea: breakfastTea,
            breakfastJuice: breakfastJuice,
            breakfastYogurt: breakfastYogurt,
            breakfastFries: breakfastFries,
            breakfastTears: breakfastTears,
            breakfastFruit: breakfastFruit,
            breakfastVeggies: breakfastVeggies,
            lunch: lunch,
            lunchWater: lunchWater,
            lunchSoda: lunchSoda,
            lunchMilk: lunchMilk,
            lunchTea: lunchTea,
            lunchJuice: lunchJuice,
            lunchWedges: lunchWedges,
            lunchFries: lunchFries,
            lunchPotatoes: lunchPotatoes,
            lunchFruit: lunchFruit,
            lunchVeggies: lunchVeggies,
            dinner: dinner,
            dinnerWater: dinnerWater,
            dinnerSoda: dinnerSoda,
            dinnerMilk: dinnerMilk,
            dinnerTea: dinnerTea,
            dinnerJuice: dinnerJuice,
            dinnerWedges: dinnerWedges,
            dinnerFries: dinnerFries,
            dinnerPotatoes: dinnerPotatoes,
            dinnerFruit: dinnerFruit,
            dinnerVeggies: dinnerVeggies
        });
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close()
    }
});

/* finding past orders part */
app.get("/viewOrders", (request, response) => {
    response.render("findPastOrders.ejs");
});

app.post("/pastOrdersData", async (request, response) => {
    // Retrieve form data from the request body
    const {email} = request.body;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        const collection = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection);

        const filter = { email: email };
        const users = await collection.find(filter).toArray();

        response.render("pastOrdersData.ejs", {
            users: users,
        });
    } catch (error) {
        console.error(e);
    } finally {
        await client.close();
    }
});

/* deleting a person's info */
app.get("/nixPerson", (request, response) => {
    response.render("deletePerson");
});

app.post("/nixPerson", async (request, response) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const { email } = request.body;

    try {
        await client.connect();
        const result = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .deleteMany({ email: email }); // Delete all orders related to the specified email

        response.render("deletePersonAfterward", { number: result.deletedCount });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

/* deleting the database part */
app.get("/nixDB", (request, response) => {
    response.render("deleteDB");
});

app.post("/nixDB", async (request, response) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        console.log("***** Clearing Collection *****");
        const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .deleteMany({});
        response.render("processDeleteDB", {number: result.deletedCount});
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});
