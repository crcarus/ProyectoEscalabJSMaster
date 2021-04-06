//guardo los elementso html en variables,
const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ultimoNivel = 7
let timer;
const nombre = document.getElementById("name");
const nivel = document.getElementById("nivel");
const tiempo = document.getElementById("time");

swal({
  title: 'INTRUCCIONES',
  icon: "info",
  text: 'Selecciona Empezar Juego.\nDebes esperar a que se ilumine la secuencia y seguir el patrón de iluminación.\nSi pasas, de nivel espera nuevamente que se ilumine la secuencia según el nivel que te encuentres.', 
})

class Juego {

  constructor(){
    this.inicializarJuego()
  }

  inicializarJuego() {

    this.inicializarJuego=this.inicializarJuego.bind(this)
    this.elegirColor = this.elegirColor.bind(this)
    this.siguienteNivel = this.siguienteNivel.bind(this)
    this.nivel = 1 //indicamos el nivel inicial
    this.btnEmpezar() //SERA el interuptor para inicializar una vez que se cargue el browser, ganes o pierdas.
    this.actulizarPanel()
    this.colores ={
        celeste,
        violeta,
        naranja,
        verde
    }
  }

  actulizarPanel() { //actualización panel de Usuario
    
    swal({
      title: 'Juguemos Simón Dice',
      text: 'Ingresa Tu Nombre:', 
      content: "input",
    })
    .then((name) => {
      if (name) {
        nombre.innerHTML = name;
      } else {
        nombre.innerHTML = "";
      }
      nivel.innerHTML = this.nivel = 1;
      tiempo.innerHTML = this.counter = 15;
      this.generarSecuencia();
      setTimeout(this.siguienteNivel, 500);
      this.temporizador();
    })
       
  }

  btnEmpezar(){//Validar si el botón empezar tiene la clase hide (esconde elementos para el usuario)

    if (btnEmpezar.classList.contains('hide')){ //Valida si tiene la clase hide.
      btnEmpezar.classList.remove('hide')//si la contiene la quita
    }
    else{
      btnEmpezar.classList.add('hide')//sino la agrega
    }
  }

  temporizador() { //Tiempo de Juego para cada nivel. 

    this.timer = setInterval(() => {
      this.counter--;
      if (this.counter < 0) {
        clearInterval(this.timer);
        this.perdioElJuego();
        console.log("Se termino el tiempo");
      } else {
        tiempo.innerText = this.counter;
        console.log("Contador");
      }
    }, 1000);
  }

  //Fx que genera la secuencia del juego hasta el ultimo Nivel.
  generarSecuencia(){

    this.secuencia=new Array(ultimoNivel)
      .fill(0).map(n=>Math
        .floor(Math.random()*4))
    //array(n): defino un array fijo de n posiciones.
    //Metodo Fill(x): completo el array con valores x en todas sus posiciones
    //Metodo MAP() remplaza los valores de un array según calculo
    //Math.Floor: redondeamos el valor a un entero.
    //Math.Random: genero decimales entre 0 y 1.
    console.log(`Secuencia Juego Completo: ${this.secuencia}`);  
  }

  siguienteNivel(){//fx para pasar siguiente nivel
    //cada vez que paso de nivel hare que el subnivel parta en cero
    this.subnivel=0
    nivel.innerHTML = this.nivel;
    console.log(`Nivel Actual: ${this.nivel}`);
    this.iluminarSecuencia() //Se ejecuta la secuencia segun nivel
    this.agregarEventosClick() //al pasar de nivel se vuelve a agregar los eventos de click
  }

  transformarNumeroAColor(numero){
    //del generar secuencia esto nos dara un numero entre 0 y 3, aca definimos que numero es cada color..
    switch (numero) {
      case 0:
          return 'celeste'
      case 1:
        return 'violeta'
      case 2:
        return 'naranja'
      case 3:
        return 'verde'
    }
  }
  transformarColorANumero(color){//aca definimos que color es cada numero
    switch (color) {
      case 'celeste':
        return 0
      case 'violeta':
        return 1
      case 'naranja':
        return 2
      case 'verde':
        return 3
    }
  }

  iluminarSecuencia(){
    //recorro el array de la secuencia hasta el nivel que este el usuario        
    for (let i = 0; i < this.nivel; i++){
      const color = this.transformarNumeroAColor(this.secuencia[i]) //trasnformo el numero que me entrega la secuencia a color
      console.log(color);
      setTimeout(() => this.iluminarColor(color), 1200 * i)//le doy un tiempo a la secuencia para iluminar el color
    }
  }

  //FX para iluminar color
  iluminarColor(color){
    //agregamos la claseStyle a colores
    this.colores[color].classList.add("light")
    setTimeout(() => this.apagarColor(color), 350)//dentro de x tiempo ejecuto FX apagarColor
  }

  //FX para apagar el color
  apagarColor(color){
    this.colores[color].classList.remove('light')
    }

  agregarEventosClick(){
    //Se agrega un manejador de eventos Click (del mouse.) y se ejecuta elegir color
    
    this.colores.celeste.addEventListener('click', this.elegirColor)//(nombre evento, fx a ejecutar)
    this.colores.verde.addEventListener('click', this.elegirColor)
    this.colores.violeta.addEventListener('click', this.elegirColor)
    this.colores.naranja.addEventListener('click', this.elegirColor)
  }

  //para remover el input agregado al manejador de eventos (click)
  eliminarEventosClick(){
    this.colores.celeste.removeEventListener('click', this.elegirColor)
    this.colores.verde.removeEventListener('click', this.elegirColor)
    this.colores.violeta.removeEventListener('click', this.elegirColor)
    this.colores.naranja.removeEventListener('click', this.elegirColor)
  }

  elegirColor(e){
    //MOUSE EVENT - nos entrega en que elemento se realizo el click (DATASET)
    const nombreColor = e.target.dataset.color //me entrega el color dentro del MOUSE EVENT
    const numeroColor = this.transformarColorANumero(nombreColor)// transformamos el color a numero
    this.iluminarColor(nombreColor)//iluminamos el color seleccionado
        
    if (numeroColor === this.secuencia[this.subnivel]){
      //se compara si el numerocolor es igual al numero de la secuencia en la posicion del subnivel que se encuentre el usuario
      //el primer subnivel es 0, entonces corresponde al primer boton que elija el usuario
    
      this.subnivel++ 
      if (this.subnivel === this.nivel){// si son iguales, el usuario pasa de nivel
        this.nivel++
        console.log(`Pasaste al nivel ${this.nivel}`);
        this.eliminarEventosClick()// el usuario no debe seguir eligiendo colores.
        if (this.nivel === (ultimoNivel + 1)){
          clearInterval(this.timer); //limpio el temporizador de tiempo [Gano]
          this.ganoElJuego()
        }
        else{
          clearInterval(this.timer);//limpio el temporizador de tiempo [Paso nivel]
          swal({
            text: `Muy bien!, avanzas al nivel: ${this.nivel}!`,
            icon: "success",
            timer: 2000,
            buttons: false,
          })
          .then(() => {
            tiempo.innerHTML = this.counter = 15;
            this.temporizador();
            setTimeout(this.siguienteNivel(), 1500);
          });
        }
        }
    }
    else{
      this.perdioElJuego()
      clearInterval(this.timer);//limpio el temporizador de tiempo [Perdio]
    }
  }
  //Uso de promesas si gana o pierde.
  ganoElJuego(){
    swal({ 
      title: 'Felicitaciones!', 
      text: 'Ganaste el juego!', 
      icon: 'success'
      })
      .then(() => {
      this.eliminarEventosClick();
      this.btnEmpezar();
      });
  }

  perdioElJuego(){
    swal({
      title: 'Perdiste!', 
      text: `Llegaste al nivel ${this.nivel}.\nInténtalo nuevamente!`, 
      icon: 'error' 
      })
    .then(() => {
      this.eliminarEventosClick()
      this.btnEmpezar();
    })
  }
}

function empezarJuego() {
    let juego = new Juego()
  }