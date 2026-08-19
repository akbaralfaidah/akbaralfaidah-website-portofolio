import { Component } from 'react';

/**
 * ErrorBoundary — catches JavaScript errors in child component tree
 * and displays a fallback UI instead of crashing the whole app.
 * (Security Fix #11)
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, you could send this to an error reporting service
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'Outfit', 'Poppins', sans-serif",
            backgroundColor: '#FAF8ED',
            color: '#2D2E32',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            Terjadi Kesalahan
          </h1>
          <p
            style={{
              fontSize: '1rem',
              opacity: 0.7,
              maxWidth: '420px',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman atau kembali ke beranda.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#2D2E32',
              color: '#FAF8ED',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Kembali ke Beranda
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
