import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header.jsx'
import TopicSelector from './components/TopicSelector.jsx'
import useNews from './hooks/useNews'
import Card from './components/Card.jsx'
import ArticlePage from './Pages/ArticlePage.jsx'


const summaryCache = new Map()

function Home() {
  
  const [topics, setTopics] = useState(['general']) 
  const [debouncedTopics, setDebouncedTopics] = useState(['general']) // 🔧 ensure sync on initial load
  const [page, setPage] = useState(1)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const [summaryData, setSummaryData] = useState(null)
  const [summarizing, setSummarizing] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  const navigate = useNavigate()

  // Debounce topic selection and reset page
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTopics(topics)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [topics])

  // Fetch paginated news
  const { news, loading, error, hasMore } = useNews(debouncedTopics, page)

  // AI Summary
  useEffect(() => {
    if (!selectedArticle) return
    const key = selectedArticle.url
    if (summaryCache.has(key)) {
      setSummaryData(summaryCache.get(key))
      return
    }
    setSummarizing(true)
    setSummaryError(null)

    const prompt = `
You are a professional news summarizer.

Summarize the following news content into a detailed summary that is at least 7 to 10 full sentences long. Include key facts, people, events, numbers, and causes. Do not shorten it too much. Be informative but clear and readable.

Also provide one emoji that best represents the sentiment.

Return ONLY valid JSON in this format:
{"summary": "Your long summary here...", "emoji": "🙂"}

Content:
"${selectedArticle.content || selectedArticle.description || ''}"
`

    axios
      .post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      )
      .then((resp) => {
        const data = JSON.parse(resp.data.choices[0].message.content.trim())
        summaryCache.set(key, data)
        setSummaryData(data)
      })
      .catch((err) => {
        if (err.response?.status === 429) {
          const fallback = selectedArticle.content || selectedArticle.description || 'Summary not available.'
          setSummaryData({ summary: fallback, emoji: '😐' })
        } else {
          setSummaryError(err.message || 'Failed to generate summary')
        }
      })
      .finally(() => setSummarizing(false))
  }, [selectedArticle])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />

      <main className="container mx-auto p-6">
        <h2 className="text-4xl font-semibold mb-2 text-center">Pick your topic:</h2>
        <TopicSelector onChange={setTopics} />

        {/* 🔧 Optional: Show current topic info */}
        <p className="text-center text-sm text-gray-500 mt-2">
          {debouncedTopics.length === 0
            ? 'Showing latest news'
            : `Showing news for: ${debouncedTopics.join(', ')}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {news.length === 0 ? (
                <p className="text-center col-span-3">No news articles found.</p>
              ) : (
                news.map((article, i) => (
                  <motion.div
                    key={article.url}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <img
                      src={
                        article.urlToImage?.startsWith('http')
                          ? article.urlToImage
                          : 'https://source.unsplash.com/featured/?news'
                      }
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                    <h3 className="font-bold text-xl mb-2">{article.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {article.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded"
                      >
                        Summary
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate('/article', {
                            state: { ...article, summary: summaryData?.summary },
                          })
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
                      >
                        Full News
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Summary Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">{selectedArticle.title}</h2>
            <img
              src={
                selectedArticle.urlToImage?.startsWith('http')
                  ? selectedArticle.urlToImage
                  : 'https://source.unsplash.com/featured/?news'
              }
              alt={selectedArticle.title}
              className="w-full h-64 object-cover mb-4 rounded"
            />

            {summarizing ? (
              <div className="text-center py-6">
                <div className="border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin mx-auto" />
                <p className="mt-4">Generating summary…</p>
              </div>
            ) : summaryError ? (
              <p className="text-red-500 mb-4">{summaryError}</p>
            ) : (
              <p className="mb-4 whitespace-pre-line leading-relaxed">{summaryData?.summary}</p>
            )}

            <div className="flex gap-4 mb-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick={() => {
                  const utter = new SpeechSynthesisUtterance(summaryData.summary)
                  utter.rate = 1
                  window.speechSynthesis.speak(utter)
                }}
              >
                Listen
              </button>
              <button
                className="w-full bg-red-600 text-white p-2 rounded"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Top-level Routes
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article" element={<ArticlePage />} />
    </Routes>
  )
}
