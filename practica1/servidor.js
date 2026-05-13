console.log("Hola mundo JS servidor")

/*Operaciones*/
let edad1 = 11
const edad2 = 42

console.log("Edad Promedio")
console.log((edad1 + edad2)/2)

/*Medir tiempo de proceso*/
console.time('miproceso')

    for(let i=0; i < 10000000000; i++){

    }
        
console.timeEnd('miproceso')

/*Objetos tipo tabla*/
let usuarios = [
    {nombre: "Emiliano", Edad:22},
    {nombre: "Saul", Edad:24},
    {nombre: "Alex", Edad:22}
]
console.table(usuarios)