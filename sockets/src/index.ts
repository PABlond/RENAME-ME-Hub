import net, {Socket} from 'net'
import pg from 'pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

interface IClient {
  keys?: {API_KEY: string},
  socket: Socket
}

class Manager {
   clients: IClient[] = []

   storeKeys(newClient: IClient): void {
    const isNewClient = this.clients.every(({keys, socket}: IClient) => 
      newClient.keys?.API_KEY !== keys?.API_KEY && newClient.socket.remoteAddress !== socket.remoteAddress)
    if (isNewClient) this.clients.push(newClient)
   }
}
 
const main = async (): Promise<void> => {
  const prisma = new PrismaClient()
  const manager = new Manager()
  console.log(process.env.DATABASE_URL)
  const pgClient = new pg.Client(process.env.DATABASE_URL)
  await pgClient.connect()
  await pgClient.query('LISTEN AZE')

  pgClient.on('notification', async (msg) => {
      console.log('Change detected:', msg.payload)
      const rows = await prisma.interaction.findMany({where: {
        pending: true
      }})
      for await (const row of rows) {
        if (row.data)
        {

        console.log(row.data)
        }
      }    
  })

// Création du serveur
const server = net.createServer((socket: Socket) => {
  console.log('Client connecté')
  manager.clients.push({socket})


  // Gestion des données reçues du client
  socket.on('data', (data: string) => {
    const parsedData = JSON.parse(data)
    if (parsedData.info == 'infoKeys') manager.storeKeys({keys: parsedData, socket})
      console.log(manager.clients)
  })

  // Gestion de la fermeture de la connexion
  socket.on('end', () => {
    console.log('Client déconnecté')
  })

  // Gestion des erreurs de socket
  socket.on('error', err => {
    console.error(`Erreur de socket : ${err.message}`)
  })
})

const PORT = 31854
server.listen(PORT, () => {
  console.log(`Serveur de socket en écoute sur le port ${PORT}`)
})
}

main()