import { db } from "../src/lib/db";
import { estados_republica } from "../src/lib/schema";
import { inArray } from "drizzle-orm";

const estadosMexico = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas"
];

async function seedEstados() {
  console.log("Iniciando seed de estados...");
  try {
    for (const estado of estadosMexico) {
      // Intentar insertarlo. Como no tenemos un unique en nombre, mejor verificamos si existe.
      const existe = await db.query.estados_republica.findFirst({
        where: (e, { eq }) => eq(e.nombre, estado)
      });
      if (!existe) {
        await db.insert(estados_republica).values({ nombre: estado });
        console.log(`Insertado: ${estado}`);
      } else {
        console.log(`Ya existe: ${estado}`);
      }
    }
    console.log("Seed de estados completado con éxito.");
  } catch (error) {
    console.error("Error seeding estados:", error);
  }
}

seedEstados().then(() => process.exit(0)).catch(() => process.exit(1));
