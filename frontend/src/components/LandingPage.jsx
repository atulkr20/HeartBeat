import './LandingPage.css'

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="logo">Heartbeat</div>
        <button className="nav-btn" onClick={() => onNavigate('dashboard')}>
          Open Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Monitor your services <br />
            <span className="highlight">in real time</span>
          </h1>
          <p className="hero-subtitle">
            Heartbeat continuously checks your APIs and websites.
            Get instant alerts when something goes down.
          </p>
          <button className="cta-btn" onClick={() => onNavigate('dashboard')}>
            Launch Dashboard
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Checks</h3>
            <p>Monitor your services every few seconds with precise timing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Instant Alerts</h3>
            <p>Know immediately when a service goes down via dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Response Times</h3>
            <p>Track latency and performance trends over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Check Logs</h3>
            <p>Detailed history of every check with status and timing.</p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="preview-section">
        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="preview-title">Dashboard</span>
          </div>
          <div className="preview-content">
            <div className="preview-card">
              <div className="preview-row">
                <span className="preview-name">API Gateway</span>
                <span className="preview-status up">
                  <span className="status-dot"></span>UP
                </span>
              </div>
              <span className="preview-url">https://api.example.com</span>
            </div>
            <div className="preview-card">
              <div className="preview-row">
                <span className="preview-name">Database</span>
                <span className="preview-status up">
                  <span className="status-dot"></span>UP
                </span>
              </div>
              <span className="preview-url">https://db.example.com</span>
            </div>
            <div className="preview-card error">
              <div className="preview-row">
                <span className="preview-name">Payment API</span>
                <span className="preview-status down">
                  <span className="status-dot"></span>DOWN
                </span>
              </div>
              <span className="preview-url">https://pay.example.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Start monitoring in seconds</h2>
          <p>Add your first service and start tracking uptime today.</p>
          <button className="cta-btn large" onClick={() => onNavigate('dashboard')}>
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Built by Atul — Heartbeat v1</p>
      </footer>
    </div>
  )
}

export default LandingPage
