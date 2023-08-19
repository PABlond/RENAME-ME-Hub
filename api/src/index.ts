import getApp from './app'

const main = async (): Promise<void> => {
  const PORT = process.env.PORT || 34529
  const app = await getApp()
  app.listen(PORT, () => {
    console.log(`[ OK ] Server is listening on :${PORT}`)
  })
}

main()
