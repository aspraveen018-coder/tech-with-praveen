import React from 'react';
import { logSecurityEvent } from '../../utils/security';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #030614, #0a0f1f);
  padding: 20px;
`;

const ErrorCard = styled.div`
  background: rgba(10, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #ff6b6b;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  color: #a0aec0;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ErrorDetails = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 10px;
  padding: 15px;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: left;
  overflow-x: auto;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log security event
    logSecurityEvent('application_error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
            <ErrorMessage>
              An unexpected error occurred. Our team has been notified.
              Please try again or contact support if the problem persists.
            </ErrorMessage>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <strong>{this.state.error.toString()}</strong>
                {this.state.errorInfo && (
                  <details style={{ marginTop: '10px' }}>
                    <summary>Stack Trace</summary>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </details>
                )}
              </ErrorDetails>
            )}
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Button onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} style={{ background: 'transparent', border: '2px solid #00d2ff' }}>
                Go to Home
              </Button>
            </div>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;