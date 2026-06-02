export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'url is required' });
  }

  try {
    const backend = process.env.BACKEND_URL || 'https://recall-backend-production-6eba.up.railway.app';
    const response = await fetch(`${backend}/content/quick-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data.error || 'Import failed' });
    }

    return res.status(200).json({ success: true, data: data.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
