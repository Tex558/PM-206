import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import cocinaMenu from './cocina.js';
import { cajaMenu } from './caja.js';
import clienteMenu from './cliente.js';
const rl = readline.createInterface({ input, output });

function limpiarConsola() {
  console.clear();
}

function mostrarBanner() {
  limpiarConsola();
  console.log("SISTEMA CENTRAL DEL LOCAL\n");
}

async function main() {
  let salir = false;

  while (!salir) {
    mostrarBanner();
    console.log("MENÚ PRINCIPAL");
    console.log("1. Caja");
    console.log("2. Cocina");
    console.log("3. Cliente");
    console.log("4. Salir\n");

    const opcion = await rl.question("Elija un módulo (1-4): ");

    switch (opcion.trim()) {
      case '1':
        await cajaMenu(rl);
        break;
      case '2':
        await cocinaMenu(rl);
        break;
      case '3':
        await clienteMenu(rl);
        break;
      case '4':
        limpiarConsola();
        console.log("\nApagando sistema...\n");
        salir = true;
        rl.close();
        break;
      default:
        console.log("\n--> Opción inválida.");
        await rl.question("Dale ENTER para continuar...");
        break;
    }
  }
}

main().catch(err => {
  console.error("Error grave en el programa:", err);
  rl.close();
});
