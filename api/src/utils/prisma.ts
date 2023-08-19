import { PrismaClient } from '@prisma/client'

export default new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Utilisation de l'URL de la base de données à partir des variables d'environnement
    },
  },
})
