#!/usr/bin/node
import fs from "fs"

const args = process.argv

if (args.length <= 2){
  console.error("Usage: node fs.js [read | create | update | destroy]")
  process.exit(1)
}
let main_command = ""
for (let i = 0; i < args.length; i++){
  if (i === 2){
    main_command = args[i]
  }
}
args.shift()
args.shift()
console.log(args)
switch (main_command){
  case "read":
    read();
    break;
  case 'create':
    create();
    break;
  case 'update':
    update();
    break;
  case 'destroy':
    destroy();
    break;
}


function read(){
  fs.readFile('../pets.json','utf8',function(error, data){
    if(error){
        console.log(error)
    } else {
      const pets = JSON.parse(data)
        if (args[1] && args[1] >= 0 && args[1] < pets.length){
          console.log(pets[args[1]])
        }else if (!args[1]){
          console.log(pets)
        }else{
          console.error("Usage: node fs.js read INDEX")
          process.exit(1)
        }
    }
  })
}

function create(){
  fs.readFile('../pets.json','utf8',function(error, data){
    if(error){
        console.log(error)
    } else {
      const pets = JSON.parse(data)
      if (parseInt(args[1]) && args[2] && args[3]){
        const pet = {
          age: parseInt(args[1]),
          type: args[2],
          name: args[3]
        }
        pets.push(pet)
        fs.writeFile('../pets.json', JSON.stringify(pets), function(error){
          if(error){
            console.log(error)
          }else{
            console.log(pet)
          }
        })
      }else{
        console.log('Usage: node fs.js create INDEX')
      }
    }
  })
}

function update(){
  fs.readFile('../pets.json','utf8',function(error, data){
    if(error){
        console.log(error)
    } else {
      const pets = JSON.parse(data)
      if (parseInt(args[1]) && parseInt(args[1]) >= 0 && parseInt(args[1]) < pets.length && parseInt(args[2]) && args[3] && args[4] ){
        const pet = {
          age: parseInt(args[2]),
          type: args[3],
          name: args[4] 
        }
        pets.splice(parseInt(args[1]), 1, pet)
        fs.writeFile('../pets.json', JSON.stringify(pets), function(error){
          if(error){
            console.log(error)
          }else{
            console.log(pet)
          }
        })
      }else{
        console.log('Usage: node fs.js update INDEX')
      }
    }
  })


}

function destroy(){
    fs.readFile('../pets.json','utf8',function(error, data){
        if(error){
            console.log(error)
        } else {
            const pets = JSON.parse(data)
            if ((args[1]) && (args[1]) >= 0 && (args[1]) < pets.length){
            let pet = pets[args[1]]
            pets.splice(parseInt(args[1]), 1)
            fs.writeFile('../pets.json', JSON.stringify(pets), function(error){
                if(error){
                console.log(error)
                }else{
                console.log(pet)
                }
            })
            }else{
            console.log('Usage: node fs.js destroy INDEX')
            }
        }
    })
}