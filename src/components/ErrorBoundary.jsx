import { Component } from 'react';

// Error boundaries must be class components. Keeps one broken chat from crashing the whole app.
export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('Chat crashed:', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="empty">
          <h2>Something went wrong</h2>
          <button className="primary" onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
