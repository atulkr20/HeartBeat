import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AddServiceModal from './components/AddServiceModal'
import DeleteModal from './components/DeleteModal'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

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

function Dashboard() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(null)
  const [deleteService, setDeleteService] = useState(null)

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard`)
      const data = await res.json()
      // Transform dashboard data to service format
      const transformed = data.map(item => ({
        _id: item.service._id,
        name: item.service.name,
        url: item.service.url,
        interval: item.service.interval,
        status: item.last?.status || 'UNKNOWN',
        responseTime: item.last?.responseTime || 0,
        lastChecked: item.last?.checkedAt
      }))
      setServices(transformed)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async () => {
    if (!deleteService) return
    try {
      await fetch(`${API_BASE}/services/${deleteService._id}`, { method: 'DELETE' })
      setServices(services.filter(s => s._id !== deleteService._id))
      setDeleteService(null)
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const handleServiceClick = (service) => {
    setShowLogsModal(service)
  }

  const handleServiceAdded = () => {
    fetchServices()
    setShowAddModal(false)
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">HeartBeat</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          Add Service
        </button>
      </header>

      {/* Services List */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No services yet</h3>
          <p>Add your first service to start monitoring</p>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            Add Service
          </button>
        </div>
      ) : (
        <div className="services-list">
          {services.map((service) => (
            <ServiceRow
              key={service._id}
              service={service}
              onClick={() => handleServiceClick(service)}
              onDelete={() => setDeleteService(service)}
            />
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleServiceAdded}
        />
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <LogsModal
          service={showLogsModal}
          onClose={() => setShowLogsModal(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteService && (
        <DeleteModal
          service={deleteService}
          onConfirm={handleDelete}
          onCancel={() => setDeleteService(null)}
        />
      )}
    </div>
  )
}

function ServiceRow({ service, onClick, onDelete }) {
  const status = service.status || 'UNKNOWN'
  const lastChecked = service.lastChecked

  return (
    <div className="service-row" onClick={onClick}>
      <div className="service-info">
        <div className="service-name">{service.name}</div>
        <div className="service-url">{service.url}</div>
      </div>
      <div className="service-meta">
        <span className={`service-status ${status.toLowerCase()}`}>
          <span className="status-dot"></span>
          {status}
        </span>
        <span className="service-time">{formatTimeAgo(lastChecked)}</span>
        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete">
          ×
        </button>
      </div>
    </div>
  )
}

function LogsModal({ service, onClose }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/services/${service._id}/logs?limit=10`)
        const data = await res.json()
        setLogs(data.logs || [])
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch logs:', error)
        setLoading(false)
      }
    }
    fetchLogs()
  }, [service._id])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal logs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logs-header">
          <h3>{service.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="logs-url">{service.url}</div>
        <div className="logs-list">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="no-logs">No logs available</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-item">
                <span className={`log-status ${log.status?.toLowerCase()}`}>
                  {log.status || 'UNKNOWN'}
                </span>
                <span className="log-time">{log.responseTime}ms</span>
                <span className="log-date">
                  {new Date(log.checkedAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('landing')

  return currentView === 'landing' ? (
    <LandingPage onNavigate={setCurrentView} />
  ) : (
    <Dashboard onNavigate={setCurrentView} />
  )
}

export default App
