import './ServiceCard.css'

function formatTimeAgo(dateString) {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function ServiceCard({ service, last, onClick }) {
  const status = last?.status || 'unknown'
  const responseTime = last?.responseTime || 0
  const lastChecked = last?.checkedAt || service.createdAt

  return (
    <div className={`service-card ${status}`} onClick={onClick}>
      <div className="card-header">
        <h3 className="service-name">{service.name}</h3>
        <span className={`status-badge ${status}`}>
          <span className="status-dot"></span>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="service-url">{service.url}</div>
      <div className="card-footer">
        <div className="metric">
          <span className="metric-label">Response</span>
          <span className="metric-value">{responseTime}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">Checked</span>
          <span className="metric-value">{formatTimeAgo(lastChecked)}</span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
