/* eslint-disable prettier/prettier */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  errorElement?: ReactNode;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (error instanceof SyntaxError || error instanceof ReferenceError) {
      // Handle specific error case
      return { hasError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You can also log the error to a service like Sentry
  }

  render() {
    const { hasError } = this.state;
    const { errorElement } = this.props;

    if (hasError) {
      return (
        errorElement || <div>Something went wrong. Please try again later.</div>
      );
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
