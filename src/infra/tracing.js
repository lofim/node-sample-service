const { NodeTracerProvider } = require("@opentelemetry/node");
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/tracing");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

const provider = new NodeTracerProvider();

provider.register();

// Register exporter to jaeger/zipkin/xray/etc.
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new PinoInstrumentation(),
    // TODO add kafka instrumentation
  ],
});
