import { useState } from 'react'
import './AddServiceModal.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function AddServiceModal({ onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setIntervalValue] = useState('60')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          interval: parseInt(interval, 10)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create service')
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Service</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg">{error}</div>}
            <div className="form-group">
              <label htmlFor="name">Service Name</label>
              <input
                id="name"
                type="text"
                placeholder="My API"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="url">Service URL</label>
              <input
                id="url"
                type="url"
                placeholder="https://api.example.com/health"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="interval">Check Interval (seconds)</label>
              <input
                id="interval"
                type="number"
                min="10"
                max="3600"
                value={interval}
                onChange={(e) => setIntervalValue(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddServiceModal
