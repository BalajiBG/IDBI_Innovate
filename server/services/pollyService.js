const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');

const client = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

/**
 * Synthesizes speech from text using Amazon Polly (Aditi voice, Hindi).
 * Returns base64-encoded audio data URL.
 */
async function synthesizeSpeech(text, voiceId = 'Aditi', languageCode = 'hi-IN') {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    LanguageCode: languageCode,
    Engine: 'neural'
  });

  const response = await client.send(command);

  // Convert audio stream to base64 data URL
  const chunks = [];
  for await (const chunk of response.AudioStream) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);
  const base64Audio = audioBuffer.toString('base64');
  return `data:audio/mp3;base64,${base64Audio}`;
}

module.exports = { synthesizeSpeech };
