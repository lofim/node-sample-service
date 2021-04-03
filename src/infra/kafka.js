const { Kafka } = require('kafkajs');
const config = require('../config');
const logger = require('./logger');

const client = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.brokers],
});

const producer = client.producer();
const consumer = client.consumer({ groupId: config.kafka.groupId });

async function init() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: config.kafka.topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.debug(`Received message from topic: ${topic}, partition: ${partition}, with %o`, {
        key: message.key,
        headers: message.headers.toString(),
        value: message.value.toString(),
      });
    },
  });
}

async function destroy() {
  await consumer.disconnect();
  await producer.disconnect();
}

async function sendMessage(key, payload) {
  return producer.send({
    topic: config.kafka.topic,
    messages: [
      { key, value: JSON.stringify(payload) },
    ],
  });
}

module.exports = {
  client,
  init,
  destroy,
  sendMessage,
};
