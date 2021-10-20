import { EachMessagePayload, Kafka, logLevel } from 'kafkajs';
import config from '../../config';
import defaultLogger from '../logger';

const logger = defaultLogger.child({ module: 'Kafka' });

function PinoLogCreator() {
    return ({ namespace, level, log }: any) => {
        const { message, ...extra } = log;

        switch (level) {
            case logLevel.ERROR:
            case logLevel.NOTHING:
                logger.error({ namespace, ...extra }, message);
                break;
            case logLevel.WARN:
                logger.warn({ namespace, ...extra }, message);
                break;
            case logLevel.INFO:
                logger.info({ namespace, ...extra }, message);
                break;
            case logLevel.DEBUG:
            default:
                logger.debug({ namespace, ...extra }, message);
        }
    };
}

export const client = new Kafka({
    clientId: config.kafka.clientId,
    brokers: [config.kafka.brokers],
    logCreator: PinoLogCreator,
    logLevel: logLevel.INFO,
});

const producer = client.producer();
const consumer = client.consumer({ groupId: config.kafka.groupId });

export async function init() {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: config.kafka.topic });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            logger.debug(`Received message from topic: ${topic}, partition: ${partition}, with %o`, {
                key: message.key,
                headers: message.headers?.toString(),
                value: message.value?.toString(),
            });
        },
    });
}

export async function destroy() {
    await consumer.disconnect();
    await producer.disconnect();
}

export async function sendMessage(key: string, payload: any) {
    return producer.send({
        topic: config.kafka.topic,
        messages: [
            { key, value: JSON.stringify(payload) },
        ],
    });
}
