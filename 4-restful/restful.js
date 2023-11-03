'use strict'

import express from 'express'
import {promises as fs} from 'fs'

const petPath = './pets.json'
const app = express()

const PORT = 4000



app.use(express.json())

const getPetsObj = async () => {
    const petData = await fs.readFile(petPath, 'utf8')
    return JSON.parse(petData)
}


app.get('/pets', async (req,res) => {
    try{
        const pets = await getPetsObj();
        res.status(200).json(pets)
    } catch (error){
        res.status(500).send('Internal Server Error')
    }
})

app.get('/pets/:id', async (req,res) => {
    try{
        const pets = await getPetsObj()
        aName = req.params.id
        const index = parseInt(aName, 10)
        console.log(index)
        const result = pets.filter(obj => Object.values(obj).includes(aName, 10))
        console.log(result)
        if (isNaN(index)){
            if (req.params.id === result){
                return res.status(200).json(result)
            }else{
                console.log('err')
                return res.status(400).send('Bad Request: Invalid pet index')
            }
        }

        if(index >= pets.length || index < 0){
            res.status(404).send('Not Found')
        }else{
            res.status(200).json(pets[index])
        }
    }catch(error){
        console.log(error)
        console.log('end')
        res.status(500).send('Internal Server Error')
    }
})

app.post('/pets', async (req,res) => {
    try{
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
        res.status(500).send('Internal Server Error')
    }
})

app.patch('/pets/:id', async (req,res) => {
    try{

    }catch (error){
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