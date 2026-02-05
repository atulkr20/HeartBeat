import { useState } from 'react'
import './AddServiceForm.css'

const API_BASE = '/api'

function AddServiceForm({ onServiceAdded }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setInterval] = useState(60)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !url) return

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, interval: Number(interval) })
      })

      if (res.ok) {
        setName('')
        setUrl('')
        setInterval(60)
        onServiceAdded()
      } else {
        alert('Failed to add service')
      }
    } catch (error) {
      console.error('Failed to add service:', error)
      alert('Failed to add service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add New Service</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Website"
            required
          />
        </div>
        <div className="form-group">
          <label>URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Interval (sec)</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            min="10"
            required
          />
        </div>
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </div>
    </form>
  )
}

export default AddServiceForm
