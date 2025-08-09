
import { useState, useEffect } from 'react';
import axios from 'axios';

const TOPIC_MAP = {
  tech:          'technology',
  sports:        'sports',
  finance:       'finance',
  health:        'health',
  entertainment: 'entertainment',
};

const useNews = (topics, page = 1) => {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (topics.length === 0) {
      setNews([]);
      setHasMore(false);
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey   = import.meta.env.VITE_NEWSAPI_KEY;
        const key      = topics[0];
        const query    = TOPIC_MAP[key] || key;  // e.g. "technology" or "finance"
        const pageSize = 9;

        const resp = await axios.get(
          'https://newsapi.org/v2/everything',
          {
            params: {
              apiKey,
              q: query,
              page,
              pageSize,
              language: 'en',
              sortBy: 'publishedAt',
            },
          }
        );

        const articles = resp.data.articles || [];
        setHasMore(articles.length === pageSize);

        setNews(prev => {
          const combined = page === 1 ? articles : [...prev, ...articles];
          return combined.filter(
            (item, idx, arr) =>
              arr.findIndex(a => a.url === item.url) === idx
          );
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [topics, page]);

  return { news, loading, error, hasMore };
};

export default useNews;
