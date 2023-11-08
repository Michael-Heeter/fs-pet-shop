'use strict'

import express from 'express'
import {promises as fs} from 'fs'

const petPath = './pets.json'
const app = express()

const PORT = 4000


const getPetsObj = async () => {
    const petData = await fs.readFile(petPath, 'utf8')
    return JSON.parse(petData)
}

// const savePetsObj = async (pets) => {
//     try {
//         const data = JSON.stringify(pets, null, 2)
//         fs.writeFileSync('pets.json', data)
//     } catch (error) {
//         console.error(error)
//         throw new Error('Error while saving pets data')
//     }
// }

app.use((err,req,res,next) => {
    if(err){
        res.status(500).send('Internal Server Error')
    }else{
        next()
    }
})

app.get('/pets', async (req,res) => {
    try{
        const pets = await getPetsObj();
        res.status(200).json(pets)
    } catch (error){
        res.status(500).send('Internal Server Error')
    }
})

app.get('/pets/:id', async (req, res) => {
    try {
        const pets = await getPetsObj();
        const id = req.params.id;
        const index = parseInt(id, 10);

        if (isNaN(index)) {
            const result = pets.find(pet => pet.name === id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Not Found');
            }
        } else {
            if (index >= pets.length || index < 0) {
                res.status(404).send('Not Found');
            } else {
                res.status(200).json(pets[index]);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/pets', async (req, res) => {
    console.log(req.body)
    try {
        console.log('Request Body:', req.body)
        const { name, age, kind } = req.body

        if (!name || !age || !kind) {
            return res.status(400).send('Bad request')
        }
        const newPet = { name, age, kind }
        const pets = await getPetsObj()
        pets.push(newPet)
        await fs.writeFile(petPath, JSON.stringify(pets))
        res.status(201).send('Pet created successfully')
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})

app.patch('/pets/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const {age,kind,name} = req.body
        const pets = await getPetsObj()
        const pet = pets.find(pet => pet.id == id)
        if (!pet) {
            res.status(404).send('Pet not found')
        }
        if(name) pet.name = name
        if(age) pet.age = age
        if(kind) pet.kind = kind
        await savePetsObj(pets)
        res.send(pet)
    }catch (error){
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
})

app.delete('/pets/:id', async (req,res) => {
    try{
        const index = parseInt(req.params.id)
        if (isNaN(index)){
            return res.status(400).send('Bad Request: Invalid pet index')
        }
        const pets = await getPetsObj()
        if(index >= pets.length || index < 0){
            res.status(404).send('Not Found')
        }else{
            res.status(200).json(pets[index])
            pets.splice(index, 1)
            await fs.writeFile(petPath, JSON.stringify(pets))
        }
    }catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

app.use((req,res) => {
    res.status(404).send('Not Found')
})

app.listen(PORT, () => {
    console.log(`Server running on port`, PORT)
})
