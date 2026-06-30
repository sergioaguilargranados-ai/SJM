import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// Definición de las columnas de la plantilla
const columns = [
  "Sede Responsable",
  "Casa de Retiro",
  "Tipo de Retiro / Evento",
  "Nombre del Evento",
  "Fecha Inicio",
  "Fecha Fin",
  "Aportación Sugerida",
  "Cupo Máximo",
  "Descripción",
  "Recomendaciones"
];

// Ejemplo de datos para orientar al usuario
const exampleRow = {
  "Sede Responsable": "Toluca",
  "Casa de Retiro": "Centro Arquidiocesano de Formación Integral",
  "Tipo de Retiro / Evento": "RENASE - RETIRO NACIONAL DE SERVIDORES",
  "Nombre del Evento": "RENASE 2026 EDICIÓN ESPECIAL",
  "Fecha Inicio": "25/07/2026 14:00",
  "Fecha Fin": "30/07/2026 19:00",
  "Aportación Sugerida": 3700,
  "Cupo Máximo": 130,
  "Descripción": "El mejor retiro del año. Incluye hospedaje y alimentación completa.",
  "Recomendaciones": "Llevar ropa cómoda, Biblia, cuaderno."
};

function generateTemplate() {
  const ws = XLSX.utils.json_to_sheet([exampleRow], { header: columns });
  
  // Ajustar anchos de columna para mejor visualización
  const wscols = columns.map(c => ({ wch: c.length + 5 }));
  wscols[8].wch = 40; // Descripción más ancha
  wscols[9].wch = 40; // Recomendaciones más ancha
  ws['!cols'] = wscols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Eventos y Retiros");

  const dirPath = path.join(process.cwd(), "public");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "plantilla_eventos.xlsx");
  XLSX.writeFile(wb, filePath);
  
  console.log(`Plantilla generada exitosamente en: ${filePath}`);
}

generateTemplate();
