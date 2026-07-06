const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Limpia si quedó algo a medias
  await prisma.submission.deleteMany({});
  await prisma.challenge.deleteMany({});

  // Inserta el reto de prueba requerido
  await prisma.challenge.create({
    data: {
      title: "Función Suma Básica",
      description: "Escribe una función llamada sumar que reciba dos parámetros (a y b) y devuelva su suma. Recuerda usar la palabra clave return.",
      difficulty: "Fácil"
    }
  });

  console.log("✅ Reto de prueba insertado con éxito en dev.db");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });