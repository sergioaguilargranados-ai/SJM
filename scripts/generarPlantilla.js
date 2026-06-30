const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function generarPlantilla() {
  const columnas = [
    "Nombre",
    "Correo",
    "Celular",
    "Sexo",
    "FechaNacimiento",
    "EstadoCivil",
    "AvanceServidor",
    "FechaIngreso",
    "Ministerio",
    "Cargo",
    "Sede",
    "DomicilioCalle",
    "Colonia",
    "CodigoPostal",
    "TelefonoCasaTrabajo",
    "TelsEmergencia",
    "ContactoEmergencia",
    "Facebook",
    "Instagram",
    "TikTok",
    "YouTube",
    "RetirosTomados (Detalle)",
    "RetirosOtrasComunidades (Detalle)",
    "ServiciosSJM",
    "Observaciones"
  ];

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([columnas]);

  // Adjust column widths slightly
  ws['!cols'] = columnas.map(() => ({ wch: 20 }));

  xlsx.utils.book_append_sheet(wb, ws, "Servidores");

  const publicDir = path.join(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, "plantilla_servidores.xlsx");
  xlsx.writeFile(wb, filePath);
  console.log("Plantilla generada exitosamente en:", filePath);
}

generarPlantilla();
