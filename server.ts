import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { PRODUCTS, DEFAULT_INSTAGRAM_ITEMS, DEFAULT_INSTAGRAM_HANDLE, DEFAULT_INSTAGRAM_PROFILE_URL, TIKTOK_REELS, DEFAULT_CRAFT_STORY } from './src/data/products.ts';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // JSON body parser with generous limit for product uploads, videos, and base64 images
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Ensure necessary data directories exist
  const dataDir = path.resolve(process.cwd(), 'src/data');
  const productsJsonPath = path.resolve(dataDir, 'products.json');
  const instagramJournalJsonPath = path.resolve(dataDir, 'instagram_journal.json');
  const instagramSettingsJsonPath = path.resolve(dataDir, 'instagram_settings.json');
  const tiktokReelsJsonPath = path.resolve(dataDir, 'tiktok_reels.json');
  const craftStoryJsonPath = path.resolve(dataDir, 'craft_story.json');

  // GET /api/products
  app.get('/api/products', (_req, res) => {
    try {
      if (fs.existsSync(productsJsonPath)) {
        const data = fs.readFileSync(productsJsonPath, 'utf-8');
        return res.json(JSON.parse(data));
      }
      return res.json(PRODUCTS);
    } catch (err) {
      console.error('Error reading products.json:', err);
      return res.status(500).json({ error: 'Failed to read products' });
    }
  });

  // Helper to sanitize images so we never serve broken ephemeral /uploads/ paths
  const processImages = (images: string[]): string[] => {
    return (images || []).map((imgUrl) => {
      if (typeof imgUrl === 'string' && imgUrl.startsWith('/uploads/')) {
        return 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80';
      }
      return imgUrl;
    });
  };

  // POST /api/products - Save entire product catalog persistently
  app.post('/api/products', (req, res) => {
    try {
      const incomingProducts = req.body;
      if (!Array.isArray(incomingProducts)) {
        return res.status(400).json({ error: 'Expected an array of products' });
      }

      const cleanedProducts = incomingProducts.map((prod) => {
        const cleanImages = processImages(prod.images || []);
        return {
          ...prod,
          images: cleanImages,
        };
      });

      fs.writeFileSync(productsJsonPath, JSON.stringify(cleanedProducts, null, 2), 'utf-8');
      return res.json({ success: true, products: cleanedProducts });
    } catch (err) {
      console.error('Error saving products to products.json:', err);
      return res.status(500).json({ error: 'Failed to save products' });
    }
  });

  // POST /api/upload - Single image upload directly returns data url for permanent storage
  app.post('/api/upload', (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Invalid image data' });
      }
      return res.json({ success: true, url: image });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to process upload' });
    }
  });

  // GET /api/instagram-journal - Retrieve permanently saved Instagram journal items
  app.get('/api/instagram-journal', (_req, res) => {
    try {
      if (fs.existsSync(instagramJournalJsonPath)) {
        const raw = fs.readFileSync(instagramJournalJsonPath, 'utf-8');
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          return res.json(items);
        }
      }
      return res.json(DEFAULT_INSTAGRAM_ITEMS);
    } catch (err) {
      console.error('Error reading instagram_journal.json:', err);
      return res.json(DEFAULT_INSTAGRAM_ITEMS);
    }
  });

  // POST /api/instagram-journal - Save Instagram journal items permanently to server disk
  app.post('/api/instagram-journal', (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Expected an array of InstagramJournalItems' });
      }
      fs.writeFileSync(instagramJournalJsonPath, JSON.stringify(items, null, 2), 'utf-8');
      return res.json({ success: true, items });
    } catch (err: any) {
      console.error('Error saving instagram_journal.json:', err);
      return res.status(500).json({ error: err.message || 'Failed to save Instagram journal' });
    }
  });

  // GET /api/instagram-settings - Retrieve official handle and profile URL
  app.get('/api/instagram-settings', (_req, res) => {
    try {
      if (fs.existsSync(instagramSettingsJsonPath)) {
        const raw = fs.readFileSync(instagramSettingsJsonPath, 'utf-8');
        return res.json(JSON.parse(raw));
      }
      return res.json({ handle: DEFAULT_INSTAGRAM_HANDLE, profileUrl: DEFAULT_INSTAGRAM_PROFILE_URL });
    } catch (err) {
      return res.json({ handle: DEFAULT_INSTAGRAM_HANDLE, profileUrl: DEFAULT_INSTAGRAM_PROFILE_URL });
    }
  });

  // POST /api/instagram-settings - Update official handle and profile URL permanently
  app.post('/api/instagram-settings', (req, res) => {
    try {
      const { handle, profileUrl } = req.body;
      const data = {
        handle: handle || DEFAULT_INSTAGRAM_HANDLE,
        profileUrl: profileUrl || DEFAULT_INSTAGRAM_PROFILE_URL,
      };
      fs.writeFileSync(instagramSettingsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, ...data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to save Instagram settings' });
    }
  });

  // GET /api/tiktok-reels - Retrieve permanently saved TikTok reels
  app.get('/api/tiktok-reels', (_req, res) => {
    try {
      if (fs.existsSync(tiktokReelsJsonPath)) {
        const raw = fs.readFileSync(tiktokReelsJsonPath, 'utf-8');
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0) {
          return res.json(items);
        }
      }
      return res.json(TIKTOK_REELS);
    } catch (err) {
      console.error('Error reading tiktok_reels.json:', err);
      return res.json(TIKTOK_REELS);
    }
  });

  // POST /api/tiktok-reels - Save TikTok reels permanently to server disk
  app.post('/api/tiktok-reels', (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Expected an array of TikTok reels' });
      }
      fs.writeFileSync(tiktokReelsJsonPath, JSON.stringify(items, null, 2), 'utf-8');
      return res.json({ success: true, items });
    } catch (err: any) {
      console.error('Error saving tiktok_reels.json:', err);
      return res.status(500).json({ error: err.message || 'Failed to save TikTok reels' });
    }
  });

  // GET /api/craft-story - Retrieve permanently saved Craft Story
  app.get('/api/craft-story', (_req, res) => {
    try {
      if (fs.existsSync(craftStoryJsonPath)) {
        const raw = fs.readFileSync(craftStoryJsonPath, 'utf-8');
        return res.json(JSON.parse(raw));
      }
      return res.json(DEFAULT_CRAFT_STORY);
    } catch (err) {
      console.error('Error reading craft_story.json:', err);
      return res.json(DEFAULT_CRAFT_STORY);
    }
  });

  // POST /api/craft-story - Save Craft Story permanently to server disk
  app.post('/api/craft-story', (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Expected craft story object' });
      }
      fs.writeFileSync(craftStoryJsonPath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, story: data });
    } catch (err: any) {
      console.error('Error saving craft_story.json:', err);
      return res.status(500).json({ error: err.message || 'Failed to save craft story' });
    }
  });

  // POST /api/upload-video - Upload custom video directly and save to public/instagram_videos
  app.post('/api/upload-video', (req, res) => {
    try {
      const { videoBase64, filename } = req.body;
      if (!videoBase64) {
        return res.status(400).json({ error: 'Missing videoBase64 data' });
      }

      const igDir = path.resolve(process.cwd(), 'public/instagram_videos');
      if (!fs.existsSync(igDir)) {
        fs.mkdirSync(igDir, { recursive: true });
      }

      // Extract base64 payload
      const matches = videoBase64.match(/^data:video\/([a-zA-Z0-9_-]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = 'mp4';

      if (matches) {
        ext = matches[1] === 'quicktime' ? 'mov' : (matches[1] || 'mp4');
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        const rawBase64 = videoBase64.replace(/^data:[^;]+;base64,/, '');
        buffer = Buffer.from(rawBase64, 'base64');
      }

      const cleanBaseName = (filename || `user_vid_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const savedFilename = `${cleanBaseName}.${ext}`;
      const targetPath = path.join(igDir, savedFilename);

      fs.writeFileSync(targetPath, buffer);
      return res.json({ 
        success: true, 
        url: `/instagram_videos/${savedFilename}`,
        filename: savedFilename
      });
    } catch (err: any) {
      console.error('Error uploading video:', err);
      return res.status(500).json({ error: err.message || 'Failed to upload video' });
    }
  });

  // GET /api/available-videos - List all guaranteed working atelier and craft videos
  app.get('/api/available-videos', (_req, res) => {
    const verifiedVideos = [
      {
        id: 'vid-tourmaline-necklace',
        title: 'Tourmaline Gemstone & Baroque Pearl Knotting Reel',
        url: '/instagram_videos/DdjhhazvaRr.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        source: 'Instagram'
      },
      {
        id: 'vid-bag-weaving',
        title: 'Hand-weaving 600 Pearls Maya Aurelia Bag',
        url: '/tiktok_videos/7363984155060817160.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        source: 'TikTok'
      },
      {
        id: 'vid-pearl-shine',
        title: 'Freshwater Baroque Pearl Shine & Luster Test',
        url: '/instagram_videos/DdIUMC4BqFr.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        source: 'Instagram'
      },
      {
        id: 'vid-bridal-unboxing',
        title: 'Custom Bridal Keepsake Gift Set Unboxing',
        url: '/tiktok_videos/7625655459537603860.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        source: 'TikTok'
      },
      {
        id: 'vid-chikamugal-atelier',
        title: 'Artisan Handcrafting at Chikamugal Store',
        url: '/instagram_videos/DdMRgKdP4HK.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611591475152-478311399767?auto=format&fit=crop&w=600&q=80',
        source: 'Instagram'
      },
      {
        id: 'vid-three-tier-collar',
        title: 'Three-Layered Pearl Collar Wedding Styling',
        url: '/tiktok_videos/7453859527411125512.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        source: 'TikTok'
      },
      {
        id: 'vid-durability-test',
        title: 'Pearl Bag 15kg Tensile Core Durability Showcase',
        url: '/tiktok_videos/7495598629625842952.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        source: 'TikTok'
      }
    ];
    return res.json(verifiedVideos);
  });

  // TikTok & Instagram local cache folders for smooth native video playback
  const tiktokVideosDir = path.resolve(process.cwd(), 'public/tiktok_videos');
  if (!fs.existsSync(tiktokVideosDir)) {
    fs.mkdirSync(tiktokVideosDir, { recursive: true });
  }
  app.use('/tiktok_videos', express.static(tiktokVideosDir));

  const instagramVideosDir = path.resolve(process.cwd(), 'public/instagram_videos');
  if (!fs.existsSync(instagramVideosDir)) {
    fs.mkdirSync(instagramVideosDir, { recursive: true });
  }

  // GET /instagram_videos/:filename - streams cached video, or dynamically fetches from Instagram for future posts
  app.get('/instagram_videos/:filename', async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const localVideoPath = path.join(instagramVideosDir, filename);
      if (fs.existsSync(localVideoPath)) {
        return res.sendFile(localVideoPath);
      }
      const shortcode = filename.replace(/\.mp4$/i, '');
      if (shortcode) {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const response = await fetch(embedUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        if (response.ok) {
          const html = await response.text();
          const mp4Matches = html.match(/https?:[^"'\s<>]+\.mp4[^"'\s<>]*/g) || [];
          if (mp4Matches.length > 0 && mp4Matches[0]) {
            const rawMp4 = mp4Matches[0]
              .replace(/\\u0026/g, '&')
              .replace(/&amp;/g, '&')
              .replace(/\\/g, '');
            const vidRes = await fetch(rawMp4, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            });
            if (vidRes.ok) {
              const buf = Buffer.from(await vidRes.arrayBuffer());
              fs.writeFileSync(localVideoPath, buf);
              return res.sendFile(localVideoPath);
            }
          }
        }
      }
      return next();
    } catch {
      return next();
    }
  });

  app.use('/instagram_videos', express.static(instagramVideosDir));

  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // GET /api/tiktok-video/:id - Stream video with full Range / seeking support
  app.get('/api/tiktok-video/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const videoId = rawId.replace(/\.mp4$/i, '');
      if (!videoId) {
        return res.status(400).json({ error: 'Missing video ID' });
      }

      const localPath = path.join(tiktokVideosDir, `${videoId}.mp4`);
      if (fs.existsSync(localPath)) {
        return res.sendFile(localPath);
      }

      // If not yet cached, attempt to resolve from TikTok
      const requestedUrl = (req.query.url as string) || `https://www.tiktok.com/@artified_np/video/${videoId}`;
      const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(requestedUrl)}`);
      if (!r.ok) {
        return res.status(404).json({ error: 'Failed to fetch video stream' });
      }
      const data = await r.json();
      const playUrl = data?.data?.play || data?.data?.wmplay;
      if (!playUrl) {
        return res.status(404).json({ error: 'No playable video source found' });
      }

      const vidRes = await fetch(playUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!vidRes.ok) {
        return res.status(404).json({ error: 'Failed to download stream' });
      }

      const buffer = Buffer.from(await vidRes.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
      return res.sendFile(localPath);
    } catch (err: any) {
      console.error('Error in /api/tiktok-video/:id:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // GET /api/proxy-thumbnail - Proxies CDN images that block direct browser hotlinking
  app.get('/api/proxy-thumbnail', async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing image url' });
      }

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': imageUrl.includes('tiktok') ? 'https://www.tiktok.com/' : (imageUrl.includes('instagram') ? 'https://www.instagram.com/' : ''),
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        return res.redirect('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80');
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    } catch {
      return res.redirect('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80');
    }
  });

  // GET /api/tiktok-info - Fetch official video info & thumbnail via TikTok oEmbed
  app.get('/api/tiktok-info', async (req, res) => {
    try {
      const videoUrl = req.query.url as string;
      if (!videoUrl) {
        return res.status(400).json({ error: 'Missing video URL parameter' });
      }

      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
      const response = await fetch(oembedUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Could not fetch info from TikTok' });
      }

      const data = await response.json();
      const proxiedThumbnail = data.thumbnail_url
        ? `/api/proxy-thumbnail?url=${encodeURIComponent(data.thumbnail_url)}`
        : '';

      return res.json({
        success: true,
        title: data.title,
        author_name: data.author_name,
        author_unique_id: data.author_unique_id,
        thumbnail_url: proxiedThumbnail || data.thumbnail_url,
        raw_thumbnail_url: data.thumbnail_url,
        html: data.html,
      });
    } catch (err: any) {
      console.error('Error fetching TikTok oembed:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // GET /api/instagram-info - Automatically fetch Instagram caption, cover screenshot, and headline
  app.get('/api/instagram-info', async (req, res) => {
    try {
      const postUrl = req.query.url as string;
      if (!postUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
      }

      const match = postUrl.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
      if (!match) {
        return res.status(400).json({ error: 'Invalid Instagram URL format' });
      }

      const shortcode = match[1];
      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

      const response = await fetch(embedUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Could not fetch Instagram embed' });
      }

      const html = await response.text();

      // 1. Extract real caption
      let caption = '';
      const capMatch = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/i);
      if (capMatch) {
        caption = capMatch[1]
          .replace(/<[^>]+>/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        caption = caption.replace(/^artified_np\s+/i, '');
      }

      // 2. Extract cover photo / screenshot
      let thumbnail = '';
      const imgMatch = html.match(/class="EmbeddedMediaImage"[^>]+src="([^">]+)"/i) || html.match(/<img[^>]+class="EmbeddedMediaImage"[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        const rawImgUrl = imgMatch[1].replace(/&amp;/g, '&');
        try {
          const imgRes = await fetch(rawImgUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          });
          if (imgRes.ok) {
            const buf = Buffer.from(await imgRes.arrayBuffer());
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            thumbnail = `data:${contentType};base64,${buf.toString('base64')}`;
          }
        } catch (imgErr) {
          console.warn('Failed to convert image to base64, using raw URL:', imgErr);
          thumbnail = rawImgUrl;
        }
      }

      // 3. Extract direct MP4 video URL & cache locally
      let videoUrl = '';
      let directCdnUrl = '';
      const igDir = path.resolve(process.cwd(), 'public', 'instagram_videos');
      if (!fs.existsSync(igDir)) {
        fs.mkdirSync(igDir, { recursive: true });
      }
      const localVideoPath = path.join(igDir, `${shortcode}.mp4`);

      const mp4Matches = html.match(/https?:[^"'\s<>]+\.mp4[^"'\s<>]*/g) || [];
      if (mp4Matches.length > 0 && mp4Matches[0]) {
        const rawMp4 = mp4Matches[0]
          .replace(/\\u0026/g, '&')
          .replace(/&amp;/g, '&')
          .replace(/\\/g, '');
        directCdnUrl = rawMp4;

        if (!fs.existsSync(localVideoPath)) {
          try {
            const vidRes = await fetch(rawMp4, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            });
            if (vidRes.ok) {
              const buf = Buffer.from(await vidRes.arrayBuffer());
              fs.writeFileSync(localVideoPath, buf);
              videoUrl = `/instagram_videos/${shortcode}.mp4`;
            } else {
              videoUrl = rawMp4;
            }
          } catch (vidErr) {
            console.warn('Failed to download Instagram video locally, using direct CDN URL:', vidErr);
            videoUrl = rawMp4;
          }
        } else {
          videoUrl = `/instagram_videos/${shortcode}.mp4`;
        }
      } else if (fs.existsSync(localVideoPath)) {
        videoUrl = `/instagram_videos/${shortcode}.mp4`;
      }

      // 4. Derive clean headline
      let headline = '';
      if (caption) {
        const withoutTags = caption.replace(/#\S+/g, '').trim();
        const firstSentence = withoutTags.split(/[.\n!?]/)[0].trim();
        if (firstSentence && firstSentence.length >= 6) {
          headline = firstSentence.length > 70 ? firstSentence.slice(0, 67) + '...' : firstSentence;
        }
      }
      if (!headline) {
        headline = 'Handcrafted Jewelry • Chikamugal Collection';
      }

      return res.json({
        success: true,
        shortcode,
        headline,
        caption: caption || 'Handcrafted at our store in Chikamugal, Kathmandu. Individually hand-knotted with natural pearls and gemstones.',
        thumbnail: thumbnail || null,
        videoUrl: videoUrl || `/api/instagram-video/${shortcode}`,
        directCdnUrl: directCdnUrl || null,
        postUrl: `https://www.instagram.com/p/${shortcode}/`,
      });
    } catch (err: any) {
      console.error('Error fetching Instagram info:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // GET /api/instagram-video/:shortcode - Stream exact Instagram video with caching
  app.get('/api/instagram-video/:shortcode', async (req, res) => {
    try {
      const shortcode = req.params.shortcode;
      if (!shortcode) {
        return res.status(400).json({ error: 'Missing shortcode' });
      }

      const igDir = path.resolve(process.cwd(), 'public', 'instagram_videos');
      if (!fs.existsSync(igDir)) {
        fs.mkdirSync(igDir, { recursive: true });
      }
      const localVideoPath = path.join(igDir, `${shortcode}.mp4`);

      if (fs.existsSync(localVideoPath)) {
        return res.sendFile(localVideoPath);
      }

      // If not yet saved locally, fetch from Instagram embed
      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
      const response = await fetch(embedUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        return res.status(404).json({ error: 'Could not fetch Instagram embed' });
      }

      const html = await response.text();
      const mp4Matches = html.match(/https?:[^"'\s<>]+\.mp4[^"'\s<>]*/g) || [];
      if (mp4Matches.length === 0 || !mp4Matches[0]) {
        return res.status(404).json({ error: 'No video stream found for this Instagram post' });
      }

      const rawMp4 = mp4Matches[0]
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .replace(/\\/g, '');

      const vidRes = await fetch(rawMp4, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      if (!vidRes.ok) {
        return res.redirect(rawMp4);
      }

      const buf = Buffer.from(await vidRes.arrayBuffer());
      fs.writeFileSync(localVideoPath, buf);
      return res.sendFile(localVideoPath);
    } catch (err: any) {
      console.error('Error in /api/instagram-video/:shortcode:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Setup Vite dev server middleware or serve production build
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: Number(port), host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Artified_np full-stack server running at http://0.0.0.0:${port}`);
  });
}

startServer();
