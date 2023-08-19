import amqp, { Channel } from 'amqplib'

export const connectRabbitMQ = async (): Promise<Channel> => {
  try {
    const connection = await amqp.connect(
      'amqp://guest:guest@rabbitmq:5672',
      {}
    )

    const channel = await connection.createChannel()
    // channel.consume(
    //   'new-order',
    //   function (msg: any) {
    //     console.log(' [x] Received %s', msg.content.toString())
    //   },
    //   {
    //     noAck: true,
    //   }
    // )
    return channel
  } catch (error) {
    throw new Error('Unable to connect to RabbitMQ')
  }
}
