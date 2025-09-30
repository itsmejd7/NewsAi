
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
        // When deployed, requests go through our serverless proxy to avoid browser restrictions.

        const key      = topics[0];
        const query    = TOPIC_MAP[key] || key; 
        const pageSize = 9;

        const resp = await axios.get('/api/news', {
          params: {
            topic: query,
            page,
            pageSize,
          },
        });

        // Check for API-specific errors
        if (resp.data.status === 'error') {
          throw new Error(resp.data.message || 'News API returned an error');
        }

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
        let errorMessage = 'Failed to fetch news';
        
        if (err.response?.status === 401) {
          errorMessage = 'Invalid API key. Please check your News API key.';
        } else if (err.response?.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (err.response?.status === 500) {
          errorMessage = 'News API server error. Please try again later.';
        } else if (err.message.includes('API key is missing')) {
          errorMessage = err.message;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('News API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [topics, page]);

  return { news, loading, error, hasMore };
};

export default useNews;
