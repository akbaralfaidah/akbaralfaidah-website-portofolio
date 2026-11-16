import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
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
            fontFamily: "'Outfit', system-ui, sans-serif",
            backgroundColor: '#FAF8F2',
            color: '#222428',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8A611C',
              marginBottom: '0.75rem'
            }}
          >
            Application Notice
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}
          >
            Terjadi Kesalahan Tampilan
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: '#55585F',
              maxWidth: '420px',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Maaf, terjadi gangguan saat memuat komponen ini. Muat ulang halaman atau kembali ke beranda.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 1.75rem',
              minHeight: '44px',
              backgroundColor: '#222428',
              color: '#FAF8F2',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
