'use strict'; // Set code to strict mode to prevent errors

// nodemon restful.js
// Core Module
// import fs from 'fs'; // File System Module
import express from 'express'; // Express Module
const app = express(); // Server instance start
app.use(express.json()); // express module
const PORT = 3000; // Set port to listen to 

// Import Postgres
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "pets",
    password: "password",
    port: "5432"
})

// File Path
// const petsPath = '../pets.json' // define path to pets;

// async function importPets() { 
//     try {
//         const data = fs.readFileSync(petsPath, 'utf-8'); // grab the pets.json file and utilize FS readfile function to parse it. 
//         return JSON.parse(data) // convert from JSON data
//     } catch (err) {
//         console.error(err.message) // Log error message to console
//         return [];
//     }
// }
//  Routes 
async function routes() {
    console.log(`---ROUTES---`) // Console log that routes is executed properly

    // let pets = await importPets(); // Import read functionality


    // nodemon restful.js
    // Get All
    app.get('/pets', async (req, res, next) => {
        try {
          const result = await pool.query('SELECT * FROM pets');
          res.status(200).json(result.rows); // Respond with pets as JSON data
        } catch (err) {
          next(err); // Send error to error handling middleware
        }
      });
      
      // Get One
      app.get('/pets/:id', async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
          const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
          if (result.rows.length === 0) {
            res.status(404).send('NOT FOUND'); // 404 for resource not found
          } else {
            res.status(200).json(result.rows[0]); // Respond with the first row as JSON
          }
        } catch (err) {
          next(err); // Send error to error handling middleware
        }
      });
      


// // Post One
app.post('/pets', async (req,res, next) => {
    const newPet = req.body
    try {
        if (!newPet.age || !newPet.kind || !newPet.name){ // If the values of age, kind and name are not present in the request body...
            const error = new Error ('Invalid pet data') // Error message
            error.status = 400; // Invalid request
            res.set("Content-Type", "text/plain") //  set response content-type to text/plain
            throw error; // throw error to catch
        }
        const result = await pool.query('INSERT INTO pets(name, age, kind) VALUES($1, $2, $3) RETURNING id',
        [newPet.name, newPet.age, newPet.kind])
        newPet.id = result.rows[0].id;
        res.status(201) // Created
        res.json(newPet); // Respond with newPet as confirmation of creation
    } catch (err) {
    next (err) // Send error to error middleware
    }
})

// // Patch One 

app.patch('/pets/:id', async (req, res, next) => {
    const id= parseInt(req.params.id) // target index in the request path
    
    try {
        const petResult = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
            
        if (petResult.rowCount === 0) { // If there is no pets instance, index is not a number, index is less than zero, index is greater than pets array.length...
            const error = Error('Pet is not available') // Error message
            error.status = 404; // Not found
            throw error; // throw error to catch
        }
        const updatedFields = req.body;
        const existingPet = petResult.rows[0]; // target existing pet at pet index

        for (const key in updatedFields) { // Iterate over updatedFields object
            if (updatedFields.hasOwnProperty(key)) { // Target key(property)
                existingPet[key] = updatedFields[key] // Set existing pet key to now equal updated fields key
            }
        }
        const updateResult = await pool.query(
            'UPDATE pets SET name = $1, age = $2, kind = $3 WHERE id = $4',
            [existingPet.name, existingPet.age, existingPet.kind, id]
          );
        
        if (updateResult.rowCount === 1){
            res.status(200)
            res.json(existingPet)
        } else {
            const error = new Error('Failed to update pet')
            error.status = 500;
            throw error;
        }
    } catch (err){
        next(err); // Send error to error middleware
    }
})

// // Delete One

app.delete('/pets/:id', async(req, res, next) => {
    const id = parseInt(req.params.id) // target index in the request path
    try {
        const petResult = await pool.query('SELECT * FROM pets WHERE id = $1', [id])
        if(petResult.rowCount === 0) {  
            const error = new Error ('Pet is not available'); // Error message
            error.status = 404; // Not Found
            throw error; // throw error to catch
        }
        const deleteResult = await pool.query('DELETE FROM pets WHERE id = $1', [id])
        // Remove the pet object from the array
        if (deleteResult.rowCount === 1){
            res.status(200)
            res.json({message: 'Pet deleted succesfully'});
        } else {
            const error = new Error('Failed to delete pet')
            error.status = 500;
            throw error;
        }
    } catch (err) {
        next(err) // Send error to error middleware
    }
});

// Error Catch-All Handler

app.use((err, req, res, next) => {
    console.error(err.stack); // List errors from previous functions
    res.set("Content-Type", "text/plain"); //  set response content-type to text/plain
    res.status(err.status || 500) // Internal Server Error
    res.send(err.message); // Use the error's status or default to 500
});

// Port Listener
app.listen(PORT,  () => { 
    console.log(`Listening on Port: ${PORT}`) //Set server to listen to PORT for incoming requests
} )
}

routes(); //Initialize route function