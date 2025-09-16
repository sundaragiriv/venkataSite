import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6">We encountered an unexpected error. Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-accent px-4 py-2 rounded-lg shadow-soft hover:brightness-110 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}