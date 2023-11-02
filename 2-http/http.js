'use strict';

import fs from 'fs';
import path from 'path';
import url from 'url';

import http from 'http';
let port = process.env.PORT || 8001;

let server = http.createServer((req, res) => {
  let parsedURL = url.parse(req.url, true);
  let arg1 = parsedURL.path.split('/')[1];
  let arg2 = parsedURL.path.split('/')[2];
  let petNum = parseInt(arg2);
  let numtype = typeof petNum;

  if (req.method === 'POST' && arg1 === 'pets') {
    const dataBuffers = [];
    req.on('data', (chunk) => dataBuffers.push(chunk));
    req.on('end', () => {
      const data = Buffer.concat(dataBuffers).toString();
      let pets = [];
      pets.push(JSON.parse(data));

      if (isNaN(petNum) || numtype === 'number') {
        if (isNaN(petNum)) {
          allPets();
        } else {
          selectPet(petNum);
        }
      } else {
        defense();
      }
    });
  } else if (req.method === 'GET' && arg1 !== 'pets') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  } else if (isNaN(petNum) || numtype === 'number') {
    if (isNaN(petNum)) {
      allPets();
    } else {
      selectPet(petNum);
    }
  } else {
    defense();
  }

  function allPets() {
    fs.readFile(path.join(__dirname, '../pets.json'), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  }

  function selectPet(num) {
    fs.readFile(path.join(__dirname, '../pets.json'), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      } else {
        let pet = JSON.parse(data);
        if (num >= 0 && num < pet.length) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          let numPet = JSON.stringify(pet[num]);
          res.end(numPet);
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');
        }
      }
    });
  }

  function defense() {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log('Listening on port', port);
});