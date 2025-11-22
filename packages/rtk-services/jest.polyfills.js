/**
 * Polyfills loaded before Jest runs
 * Required for MSW to work in Node environment
 */
// TextEncoder/TextDecoder polyfill
const { TextEncoder, TextDecoder } = require('util');
// Web Streams polyfill
const { WritableStream, ReadableStream, TransformStream } = require('web-streams-polyfill');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// BroadcastChannel polyfill
global.BroadcastChannel = class BroadcastChannel {
  postMessage(_message) {}
  close() {}
};

global.WritableStream = WritableStream;
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
