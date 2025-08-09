import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export default function ArticlePage() {
  const { state: article } = useLocation()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    setAnswer(null)

    // Check if the answer is cached (using sessionStorage instead of localStorage)
    const cacheKey = `${article.title}_${question}`
    const cachedAnswer = sessionStorage.getItem(cacheKey)
    if (cachedAnswer) {
      setAnswer(cachedAnswer)
      setLoading(false)
      return
    }

    try {
      const context = article.content || article.description || article.summary || ''
      
      if (!context.trim()) {
        setError('No content available to answer questions about.')
        setLoading(false)
        return
      }

      
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
        {
          inputs: {
            question: question,
            context: context
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      console.log("Hugging Face Response:", response.data)

      let result = ''
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        if (response.data.answer) {
          result = response.data.answer
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          result = response.data[0].answer || 'No answer found'
        } else {
          result = 'Unable to generate an answer from the available content.'
        }
      } else {
        result = 'Unexpected response format from AI service.'
      }

      // Cache the result
      sessionStorage.setItem(cacheKey, result)
      setAnswer(result)

    } catch (err) {
      console.error("Error during API request:", err)

      if (err.response) {
        console.error("API Response Error:", err.response.data)
        
        // Handle specific error cases
        if (err.response.status === 401) {
          setError('API authentication failed. Please check your API key.')
        } else if (err.response.status === 503) {
          setError('AI service is currently loading. Please try again in a moment.')
        } else if (err.response.status === 429) {
          setError('Rate limit exceeded. Please try again later.')
        } else {
          setError(`API Error (${err.response.status}): ${err.response?.data?.error || err.message}`)
        }
      } else if (err.request) {
        console.error("No response received:", err.request)
        setError('Network error. Please check your connection and try again.')
      } else {
        console.error('Error:', err.message)
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key press in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleQuestionSubmit()
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p>No article data found. Please go back and select an article.</p>
      </div>
    )
  }

  const { title, urlToImage, author, publishedAt, content, description, summary, url } = article
  const formattedDate = publishedAt ? new Date(publishedAt).toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : ''

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="container mx-auto p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">News AI</h1>
        <button 
          onClick={() => window.location.href = '/'} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          Back
        </button>
      </header>

      <main className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        {urlToImage && (
          <img 
            src={urlToImage.startsWith('http') ? urlToImage : 'https://source.unsplash.com/featured/?news'} 
            alt={title} 
            className="w-full h-64 object-cover rounded mb-6" 
            onError={(e) => {
              e.target.src = 'https://source.unsplash.com/featured/?news'
            }}
          />
        )}
        
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {author && `By ${author} · `}{formattedDate}
        </p>

        <div className="prose dark:prose-dark max-w-none mb-6">
          <p className="whitespace-pre-line leading-relaxed">
            {content || description}
          </p>
        </div>

        {/* AI Summary section */}
        {summary && (
          <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
            <h3 className="text-xl font-semibold mb-2">AI Summary</h3>
            <p className="whitespace-pre-line leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Question & Answer Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Ask a Question</h3>
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Ask a question about the article... (Ctrl+Enter to submit)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleQuestionSubmit}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
              disabled={loading || !question.trim()}
            >
              {loading ? 'Processing...' : 'Ask Question'}
            </button>
          </div>

          {/* Display AI Answer */}
          {answer && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">AI Answer:</h4>
              <p className="text-green-900 dark:text-green-100">{answer}</p>
            </div>
          )}

          {/* Display Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* External link fallback */}
        {url && (
          <section className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-2">Original Source</h3>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              View full article on the original site →
            </a>
          </section>
        )}
      </main>
    </div>
  )
}