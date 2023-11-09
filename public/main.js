const btn = document.querySelector('#btn')

btn.addEventListener('click',getData)

async function getData() {
    const result = await fetch('http://localhost:3000/api/pets')
    const data = await result.json()

    createDiv(data)
}

function createDiv(arr){
    arr.forEach(elem => {
        const div = document.createElement('div')
        div.textContent = elem.name
        document.body.appendChild(div)
    })
}