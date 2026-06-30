/**
 * D-ID API Integration for Avatar Video Generation.
 * Creates talking head videos from text input.
 */

const DID_API_URL = 'https://api.d-id.com';

async function createTalk(text) {
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error('D-ID API key not configured');

  const presenterUrl = process.env.DID_PRESENTER_URL || 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg';

  // D-ID accepts the API key directly in Basic auth (key as password, empty username)
  const authHeader = apiKey.includes(':') ? `Basic ${Buffer.from(apiKey).toString('base64')}` : `Basic ${Buffer.from(':' + apiKey).toString('base64')}`;

  const response = await fetch(`${DID_API_URL}/talks`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source_url: presenterUrl,
      script: {
        type: 'text',
        input: text.substring(0, 300),
        provider: {
          type: 'microsoft',
          voice_id: 'en-IN-PrabhatNeural'
        }
      },
      config: {
        stitch: true,
        result_format: 'mp4'
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('D-ID create error:', response.status, errorBody);
    throw new Error(`D-ID API error: ${response.status}`);
  }

  return await response.json();
}

async function getTalkStatus(talkId) {
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error('D-ID API key not configured');

  const authHeader = apiKey.includes(':') ? `Basic ${Buffer.from(apiKey).toString('base64')}` : `Basic ${Buffer.from(':' + apiKey).toString('base64')}`;

  const response = await fetch(`${DID_API_URL}/talks/${talkId}`, {
    headers: {
      'Authorization': authHeader
    }
  });

  if (!response.ok) {
    throw new Error(`D-ID status error: ${response.status}`);
  }

  return await response.json();
}

module.exports = { createTalk, getTalkStatus };
