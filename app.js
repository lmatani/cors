const express = require('express');
const axios = require('axios');
const app = express();


const url = `https://rickandmortyapi.com/api/character`;

app.get('/characters', async (req, res) => {

    let arrPersonajes = [];
    
    try {
        getPersonajesAll(url).then(dataInfo => { 
            console.log( dataInfo.length);
            console.log('dataInfo: ', dataInfo);
            res.status(200).json({cantidad: dataInfo.length, personajes: dataInfo});
        });
        

    } 
    catch (error) {
        res.status(404).json({error: 'No hemos podido acceder al api de Rick &  Morti'});
    }
   
});

// si indicas un nombre, buscará todos los pesonajes que contenga dicho nombre
// si indicas un número, buscará el personaje cuyo ID coincida con dicho número
app.get('/characters/:personaje', async (req, res) => {
  
    const personaje = req.params.personaje;
    console.log( personaje);
    console.log(typeof personaje);

    try {
        const esId = Number.parseInt(personaje);
    
        if (!Number.isNaN(esId)) {
            // si es un número lanzamos la consulta por id de personaje https://rickandmortyapi.com/api/character/1
            const urlPersonaje = `${url}/${personaje}`;
            getPersonaje(urlPersonaje).then(dataInfo => { 
                console.log('dataInfo: ', dataInfo);
                res.status(200).json(dataInfo);
            });
       
        }
        else {
            // si no suponemos que es nombre y hacemos la consulta por nombre de personaje https://rickandmortyapi.com/api/character/?name=rick
            const urlPersonaje = `${url}/?name=${personaje}`;
            getPersonajesAll(urlPersonaje).then(dataInfo => { 
                console.log('dataInfo: ', dataInfo);
                console.log( dataInfo.length);
                res.status(200).json({cantidad: dataInfo.length, personajes: dataInfo});
            });
       
        }
    } 
    catch (error) {
        res.status(404).json({error: 'No hemos podido consultar el personaje.'});
    }
       
});

 async function getPersonaje(url) {
    let newPersonaje = null;
    const response = await axios.get(url);
    const dataPersonaje = response.data;
    
    if (dataPersonaje !== null && dataPersonaje !== undefined) {
        const { name, status, species, gender, origin, image} = dataPersonaje;
        newPersonaje ={ 
            Name: name,
            Status: status,
            Species: species,
            Gender: gender,
            Origin: origin.name ,
            Image: image 
        };
    }
    
    //console.log(newPersonaje);
    return newPersonaje;
 }   

 async function getPersonajesAll(url) {

    let arrPersonajes = [];
    let nextUrl = url;
    while (nextUrl !== null) {
        const response = await axios.get(nextUrl);
        const {info, results} = response.data;
        nextUrl = info.next;
        //console.log(info.next);

        if (results !== null && results !== undefined) {
            results.forEach((personaje) => {
                const { name, status, species, gender, origin, image} = personaje;
                const newPersonaje ={ 
                    Name: name,
                    Status: status,
                    Species: species,
                    Gender: gender,
                    Origin: origin.name ,
                    Image: image 
                };

                arrPersonajes.push(newPersonaje);
            });
        }
    }
    
    console.log(arrPersonajes.length);
    return arrPersonajes;  
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto ${PORT}`);
  });