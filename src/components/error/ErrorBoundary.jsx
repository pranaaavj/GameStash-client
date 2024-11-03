/* eslint-disable react/prop-types */
import { Component } from 'react';
import { GameErrorFallback } from './GameErrorFallback';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
}

  render() {
    if (this.state.hasError) {
      return <GameErrorFallback onRetry={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}
