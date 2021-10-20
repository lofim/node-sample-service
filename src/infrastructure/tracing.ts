import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/tracing';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';

const provider = new NodeTracerProvider();

provider.register();

// Register exporter to jaeger/zipkin/xray/etc.
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),
        new PinoInstrumentation(),
        new KafkaJsInstrumentation(),
    ],
});
