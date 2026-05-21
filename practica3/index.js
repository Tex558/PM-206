import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import cocinaMenu from './cocina.js';

const rl = readline.createInterface({ input, output });

function limpiarConsola() {
  console.clear();
}

function mostrarBanner() {
  limpiarConsola();
  console.log("**************************************************");
  console.log("*            SISTEMA CENTRAL DEL LOCAL           *");
  console.log("**************************************************");
}

async function main() {
  let salir = false;

  while (!salir) {
    mostrarBanner();
    console.log("\n--- MENÚ PRINCIPAL ---");
    console.log("1. Caja (En desarrollo)");
    console.log("2. Cocina");
    console.log("3. Cliente (En desarrollo)");
    console.log("4. Salir");
    console.log("**************************************************");

    const opcion = await rl.question("Elija un módulo (1-4): ");

    switch (opcion.trim()) {
      case '1':
        console.log("\nMódulo Caja en desarrollo.");
        await rl.question("Dale ENTER para continuar...");
        break;
      case '2':
        await cocinaMenu(rl);
        break;
      case '3':
        console.log("\nMódulo Cliente en desarrollo.");
        await rl.question("Dale ENTER para continuar...");
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
