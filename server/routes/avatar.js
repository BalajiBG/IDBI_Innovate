const express = require('express');
const { synthesizeSpeech } = require('../services/pollyService');
const { createTalk, getTalkStatus } = require('../services/didService');

const router = express.Router();

// POST /api/avatar/speak — Generate avatar speech
router.post('/speak', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Try Polly first
    let audioUrl = null;
    try {
      audioUrl = await synthesizeSpeech(text);
    } catch (err) {
      console.log('Polly unavailable, skipping audio:', err.message);
    }

    // Try D-ID if API key is available
    let videoUrl = null;
    if (process.env.DID_API_KEY) {
      try {
        console.log('D-ID: Creating talk...');
        const talk = await createTalk(text);
        console.log('D-ID: Talk created, id:', talk?.id);
        if (talk && talk.id) {
          // Poll for completion (max 30 seconds)
          let attempts = 0;
          while (attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const status = await getTalkStatus(talk.id);
            console.log('D-ID: Poll attempt', attempts, 'status:', status.status);
            if (status.status === 'done') {
              videoUrl = status.result_url;
              console.log('D-ID: Video ready:', videoUrl);
              break;
            }
            if (status.status === 'error' || status.status === 'rejected') {
              console.log('D-ID: Error/Rejected:', JSON.stringify(status));
              break;
            }
            attempts++;
          }
        }
      } catch (err) {
        console.log('D-ID error:', err.message);
      }
    }

    res.json({
      audioUrl,
      videoUrl,
      fallback: !videoUrl,
      duration: Math.ceil(text.length / 15) // rough estimate: 15 chars/sec for Hindi
    });
  } catch (error) {
    console.error('Avatar error:', error.message);
    res.json({ audioUrl: null, videoUrl: null, fallback: true, duration: 3 });
  }
});

// GET /api/avatar/status — Check service availability
router.get('/status', (req, res) => {
  res.json({
    didAvailable: !!process.env.DID_API_KEY,
    pollyAvailable: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_REGION),
    fallbackMode: !process.env.DID_API_KEY
  });
});

module.exports = router;
