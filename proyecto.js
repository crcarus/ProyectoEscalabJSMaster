//Clase con función Fecht para llamar la API
class Api {
    
    static baseUrl = "https://restcountries.eu/rest/v2/all"
    static fetchData = async()=>{

        try {
        const result = await fetch(Api.baseUrl)
        const parseResult = await result.json()

        // console.log(parseResult);
        obtenerPaises(parseResult)
        busquedaByPais(parseResult)
        busquedaByCapital(parseResult)
        paisPoblacionFind(parseResult)
        paislenguaje(parseResult)
        
        } catch (error) {
            console.log(error)
        }

    }  
}

console.log(Api.fetchData());

//Función Obtener paises de la APi y ejecutarlo en la 
const obtenerPaises = data => {
  
    let elementos = ''
    data.forEach(item => {
        elementos += `
        <div class="container ">
            <div class="card">
                <img class="card-img-top" src="${item.flag}" alt="Card image cap">
                <div class="card-content">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">
                        <b>Población: </b>
                        ${item.population}
                    </p>
                    <p class="card-text">
                        <b>Capital: </b>
                        ${item.capital}
                    </p>
                    <p class="card-text">
                        <b>Región: </b>
                        ${item.region}  
                </div>
            </div>        
        </div>
        `
    });
    tarjetaPaises.innerHTML = elementos
}

//FILTROS:
//BUSCAR PAIS
const buscarPais = document.getElementById('buscarPais');
const inputBuscarPais = document.getElementById('inputBuscarPais');

const busquedaByPais = data => { //Busqueda de Tarjeta Por Pais.
    buscarPais.addEventListener('keyup', e => {
        e.preventDefault()
        const inputPais = inputBuscarPais.value.toLowerCase()
        console.log(inputPais)
        const arrayFiltrado = data.filter(item => {
            const letraApi = item.name.toLowerCase()
            if (letraApi.indexOf(inputPais) !== -1) {
                return item
            }
        })
        obtenerPaises(arrayFiltrado)
    })
}

//BUSCAR CIUDAD
const buscarCapital = document.getElementById('buscarCapital');
const inputBuscarCapital = document.getElementById('inputBuscarCapital');

const busquedaByCapital = data => { //Busqueda de Tarjeta Por Ciudad
    buscarCapital.addEventListener('keyup', e => {
        const inputCapital = inputBuscarCapital.value.toLowerCase()
        localStorage.setItem("Cuidad",inputCapital)
        console.log(inputCapital)
        const arrayFiltradoCapital = data.filter(item => {
            const letraApi = item.capital.toLowerCase()
            if (letraApi.indexOf(inputCapital) !== -1) {
                return item
            }
        })
        obtenerPaises(arrayFiltradoCapital)
    })
}

//Conteo de paises por Región/Continente.
function cargaContinentes()
{
    const seleccionContinente = document.getElementById('continentes');//evento del boton buscar continente
    const continentes = seleccionContinente.options[seleccionContinente.selectedIndex].value; //obtengo valor
    // console.log(continentes);
    const url = 'https://restcountries.eu/rest/v2/all';//--> como heredo la info de la Api anterior en esta función?
    fetch(url)
        .then(data => data.json())
        .then(data => {
            let paises = data;
            let poblacionMundial= [] //array para almacenar la población de cada pais
            let continenteRegion = []; //Array paises por región seleccionada
            let poblacionByRegion=[]   //Array poblacion segun pais de región seleccionada

            paises.forEach(i=> poblacionMundial.push(i.population))//recorro api y guardo poblacion por pais. 
            // console.log(poblacionMundial);


            paises.forEach(item => { //Recorro la API
                if (item.region == continentes) {
                    continenteRegion.push(item.name); //agrego pais al array
                    poblacionByRegion.push(item.population) //Agrego población al array    
                }
            });
            
            // console.log(poblacionByRegion);

            let numeroAleatorio= Math.random()
            let cantidadPaisesArray = continenteRegion.length //Cantidad Paises segun región
            let numeroAleaPais=Math.floor(numeroAleatorio*cantidadPaisesArray)
            let paisLocalStorage=continenteRegion[numeroAleaPais]
            localStorage.setItem("Pais",paisLocalStorage)//Se almacena en el LS un pais aleatorio segun región

            // console.log(numeroAleatorio);
            // console.log(cantidadPaisesArray);
            // console.log(numeroAleaPais);
            // console.log(continenteRegion[numeroAleaPais]);
            // console.log(continentes);
            let poblacionTotal= poblacionByRegion.reduce(function(a, b){ return a + b; }) //Suma el total de poblacion por Region
            let poblacionTotalByRegion = new Intl.NumberFormat(["ban", "id"]).format(poblacionTotal) //Formato miles-

            let totalPoblacionMundial = poblacionMundial.reduce(function(a,b){return a+b})//Suma el total de poblacion Mundial.
            console.log(`Población Mundial: ${totalPoblacionMundial}`);

            let setPoblacion = poblacionByRegion.map(n =>n/totalPoblacionMundial) //Map para determinar el % del total.

            let porcentajePoblacion = setPoblacion.reduce(function(a, b){ return a + b; }).toFixed(5)//Formato.-

            const traeLocalStorage = localStorage.getItem("País") //Obtengo el valor del LS
            console.log(`Se guardo en LocalStorage el País: ${traeLocalStorage}`);

            if (continenteRegion.length > 0) {
                buscarContinente(continenteRegion, continentes,poblacionTotalByRegion, porcentajePoblacion,traeLocalStorage);//Ejecuto función buscar continente con los parametros necesarios.    
            }
        });
}

function buscarContinente(countries, region,poblacionTotalByRegion, porcentajePoblacion,traeLocalStorage)
{  
    swal({
        title: `Hay ${countries.length} paises en el continente "${region}"`, 
        text: `Poblacion total es de ${poblacionTotalByRegion} Personas \nLa Población corresponde a ${porcentajePoblacion}% del total \n\n País Guardado en LocalStorage= "${traeLocalStorage}"`, 
        icon: 'success' 
      })

}
document.querySelector('#continentes')
    .addEventListener('change', cargaContinentes);

//Consola Find:
//Primer pais de la API que supera los 200 Millos de habitantes.-->Brazil
const paisPoblacionFind = data =>{
    const paisPoblacion=data.find(i=>i.population >200000000)
    console.log(`${paisPoblacion.name} es el Primer País de la API que supera los 200 Millones de Habitantes con ${paisPoblacion.population} `);
}

//Primer pais de la API que habla mas de 5 lenguajes -->South Africa
const paislenguaje = data =>{
    const paisLenguajeCantidad=data.find(i=>i.languages.length >5)
    console.log(`${paisLenguajeCantidad.name} es el Primer País de la API que habla mas de 5 lenguajes: En total son: ${paisLenguajeCantidad.languages.length} `);
}


