export default async function handler(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const topic = url.searchParams.get('topic') || 'general';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '9', 10);

    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      return response.status(500).json({ error: 'Server is missing NEWSAPI_KEY.' });
    }

    const params = new URLSearchParams({
      apiKey,
      q: topic,
      page: String(page),
      pageSize: String(pageSize),
      language: 'en',
      sortBy: 'publishedAt',
    });

    const newsApiUrl = `https://newsapi.org/v2/everything?${params.toString()}`;

    const upstream = await fetch(newsApiUrl, { method: 'GET' });
    const data = await upstream.json();

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (upstream.ok) {
      return response.status(200).json(data);
    }

    const status = data?.status || 'error';
    const message = data?.message || 'News API error';
    return response.status(502).json({ status, message });
  } catch (err) {
    return response.status(500).json({ error: 'Unexpected server error', details: err?.message });
  }
}


