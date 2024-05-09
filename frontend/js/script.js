
function getInfoPersonaje(){
    const personajeInput = document.getElementById('nombrePersonaje');
    const personajeInfo = document.getElementById('personajeInfo');
    const nombrePersonaje = personajeInput.value.toLocaleLowerCase().trim();
    const url = 'http://localhost:3000/characters';

    if (nombrePersonaje !== '')
    {
        getApiInfo(`${url}/${nombrePersonaje}`);
    }
    else {
       //getApiInfo(url);
       personajeInfo.innerHTML = '<p>Ups, para realizar la búsqueda debes introducir un nombre!</p>';

    }
   
}

function getApiInfo(url)
{
    const personajeInfo = document.getElementById('personajeInfo');
    const lista = document.getElementById('listaPersonajes');
    lista.innerHTML = '';
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        
        if (data.personajes !== null && data.personajes !== undefined) {
            data.personajes.forEach((personaje) => {
                incluirEnLista(lista, personaje)
            });
        }
        else {
            console.log(lista);
            incluirEnLista(lista, data)
        }

    })
    .catch((error) => {
        personajeInfo.innerHTML = '<p>No se ha podido obtener la info. Prueba con otro nombre.</p>';
    });
}

function incluirEnLista(lista, personaje){
     let liElem = document.createElement('li');
    const { Name, Status, Species, Gender, Origin, Image} = personaje;
   
    liElem.innerHTML = `
            <hr/>
            <p><span>Name: </span>${Name}</p>
            <p><span>Status: </span>${Status}</p>
            <p><span>Species: </span>${Species}</p>
            <p><span>Gender: </span>${Gender}</p>
            <p><span>Origin: </span>${Origin}</p>
            <img src="${Image}" alt="${Name}">
            `;
    lista.appendChild(liElem);
}