'use strict'

import express from 'express'
import {promises as fs} from 'fs'
import pg from 'pg'
const {Pool} = pg;

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "petshop",
    password: "AllThePi",
    port: "5432"
})

// const petPath = './pets.json'
const app = express()

const PORT = 3000
app.use(express.json())

// const getPetsObj = async () => {
//     const petData = await fs.readFile(petPath, 'utf8')
//     return JSON.parse(petData)
// }



// app.use((err,req,res,next) => {
//     if(err){
//         res.sta tus(500).send('Internal Server Error')
//     }else{
//         next()
//     }
// })

app.get('/pets', async (req,res) => {
    try{
        const {rows} = await pool.query('SELECT * FROM pets');
        res.status(200).json(rows)
    } catch (error){
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
})

app.get('/pets/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const index = parseInt(id, 10);
        const {rows} = await pool.query('SELECT * FROM pets');

        if (isNaN(index)) {
            const result = rows.find(pet => pet.name === id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Not Found');
            }
        } else {
            if (index >= rows.length || index < 0) {
                res.status(404).send('Not Found');
            } else {
                res.status(200).json(rows[index]);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// app.post('/pets', async (req, res) => {
//     console.log(req.body)
//     try {
//         console.log('Request Body:', req.body)
//         const { name, age, kind } = req.body

//         if (!name || !age || !kind) {
//             return res.status(400).send('Bad request')
//         }
//         const newPet = { name, age, kind }
//         const pets = await getPetsObj()
//         pets.push(newPet)
//         await fs.writeFile(petPath, JSON.stringify(pets))
//         res.status(201).send('Pet created successfully')
//     } catch (error) {
//         console.error(error)
//         res.status(500).send('Internal Server Error')
//     }
// })

// app.patch('/pets/:id', async (req,res) => {
//     try{
//         const id = req.params.id;
//         const {age,kind,name} = req.body
//         const pets = await pool.query('SELECT * FROM pets WHERE id = $1', [id])
//         const pet = pets.find(pet => pet.id == id)
//         if (!pet) {
//             res.status(404).send('Pet not found')
//         }
//         if(name) pet.name = name
//         if(age) pet.age = age
//         if(kind) pet.kind = kind
//         await savePetsObj(pets)
//         res.send(pet)
//     }catch (error){
//         console.log(error)
//         res.status(500).send('Internal Server Error')
//     }
// })

// app.delete('/pets/:id', async (req,res) => {
//     try{
//         const index = parseInt(req.params.id)
//         if (isNaN(index)){
//             return res.status(400).send('Bad Request: Invalid pet index')
//         }
//         const pets = await getPetsObj()
//         if(index >= pets.length || index < 0){
//             res.status(404).send('Not Found')
//         }else{
//             res.status(200).json(pets[index])
//             pets.splice(index, 1)
//             await fs.writeFile(petPath, JSON.stringify(pets))
//         }
//     }catch (error) {
//         res.status(500).send('Internal Server Error')
//     }
// })

app.use((req,res) => {
    res.status(404).send('Not Found')
})

app.listen(PORT, () => {
    console.log(`Server running on port`, PORT)
})
