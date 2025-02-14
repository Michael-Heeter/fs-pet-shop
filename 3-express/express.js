'use strict'

import express from 'express'
import {promises as fs} from 'fs'

const petPath = './pets.json'
const app = express()

const PORT = 4200


const getPetsObj = async () => {
    const petData = await fs.readFile(petPath, 'utf8')
    // console.log(petData)
    return JSON.parse(petData)
}

app.use(express.json())

app.use((err,req,res,next) => {
    if(err){
        res.status(500).send('Internal Server Error1')
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

app.post('/pets', async (req,res) => {
    console.log(req.body)
    try{
        // console.log(req)
        const {name,age,kind} = req.body
        
        if(!name||!age||!kind){
            return res.status(400).send('Bad request')
        }
        const newPet = {name,age,kind}
        const pets = await getPetsObj()
        pets.push(newPet)
        await fs.writeFile(petPath, JSON.stringify(pets))
        res.status(201).send('Pet created successfully')
    } catch (error) {
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