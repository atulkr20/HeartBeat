import { useState, useEffect } from 'react'
import AddServiceForm from './components/AddServiceForm'
import ServiceCard from './components/ServiceCard'
import './App.css'

const API_BASE = '/api'

function App() {
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
      setLogs(data)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
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
    <div className="app">
      <header className="header">
        <h1>HeartBeat</h1>
        <p className="subtitle">Service Monitoring Dashboard</p>
      </header>

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

export default App
