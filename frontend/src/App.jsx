import { useState, useEffect } from 'react'
import AddServiceForm from './components/AddServiceForm'
import ServiceCard from './components/ServiceCard'
import './App.css'

const API_BASE = '/api'

// Landing Page Component
function LandingPage({ onNavigate }) {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">HeartBeat</div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Monitor your services <br />
          <span className="highlight">in real time.</span>
        </h1>
        <p className="hero-subtitle">
          HeartBeat continuously checks your APIs and shows live health status
          with response times.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary large" onClick={() => onNavigate('dashboard')}>
            Launch Dashboard
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-time monitoring</h3>
          <p>Get instant alerts when your services go down. Stay informed 24/7.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live dashboard</h3>
          <p>Beautiful overview of all your services with status indicators and metrics.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Failure logs</h3>
          <p>Detailed logs of every check failure to help you debug issues fast.</p>
        </div>
      </section>

      {/* Product Preview */}
      <section className="preview">
        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="preview-title">Dashboard</div>
          </div>
          <div className="preview-content">
            <div className="preview-card">
              <div className="card-row">
                <span className="service-name">API Gateway</span>
                <span className="status-badge up">
                  <span className="dot"></span>UP
                </span>
              </div>
              <div className="card-row">
                <span className="service-url">https://api.example.com/health</span>
                <span className="response-pill">124ms</span>
              </div>
            </div>
            <div className="preview-card">
              <div className="card-row">
                <span className="service-name">Database</span>
                <span className="status-badge up">
                  <span className="dot"></span>UP
                </span>
              </div>
              <div className="card-row">
                <span className="service-url">https://db.example.com/status</span>
                <span className="response-pill">45ms</span>
              </div>
            </div>
            <div className="preview-card error">
              <div className="card-row">
                <span className="service-name">Payment Service</span>
                <span className="status-badge down">
                  <span className="dot"></span>DOWN
                </span>
              </div>
              <div className="card-row">
                <span className="service-url">https://pay.example.com/ping</span>
                <span className="response-pill error">Timeout</span>
              </div>
            </div>
            <div className="preview-card">
              <div className="card-row">
                <span className="service-name">Auth Service</span>
                <span className="status-badge up">
                  <span className="dot"></span>UP
                </span>
              </div>
              <div className="card-row">
                <span className="service-url">https://auth.example.com/health</span>
                <span className="response-pill">89ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Built by Atul — HeartBeat v1</p>
      </footer>
    </div>
  )
}

// Dashboard Component
function Dashboard({ onNavigate }) {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard`)
      const data = await res.json()
      setServices(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setLoading(false)
    }
  }

  const fetchLogs = async (serviceId) => {
    try {
      const res = await fetch(`${API_BASE}/services/${serviceId}/logs?limit=10`)
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      setLogs([])
    }
  }

  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleServiceClick = (service) => {
    setSelectedService(service)
    fetchLogs(service._id)
  }

  const handleCloseLogs = () => {
    setSelectedService(null)
    setLogs([])
  }

  const handleServiceAdded = () => {
    fetchServices()
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => onNavigate('landing')}>
          ← Back
        </button>
        <div className="logo">HeartBeat</div>
        <div className="header-spacer"></div>
      </header>

      <div className="dashboard-content">
        <AddServiceForm onServiceAdded={handleServiceAdded} />

        {loading ? (
          <div className="loading">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <p>No services monitored yet.</p>
            <p>Add a service above to get started.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((item) => (
              <ServiceCard
                key={item.service._id}
                service={item.service}
                last={item.last}
                onClick={() => handleServiceClick(item.service)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <div className="modal-overlay" onClick={handleCloseLogs}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedService.name}</h2>
              <button className="close-btn" onClick={handleCloseLogs}>×</button>
            </div>
            <div className="modal-url">{selectedService.url}</div>
            <h3>Recent Checks</h3>
            <div className="logs-list">
              {logs.length === 0 ? (
                <p className="no-logs">No logs available</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="log-item">
                    <span className={`log-status ${log.status}`}>
                      {log.status}
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
      )}
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
