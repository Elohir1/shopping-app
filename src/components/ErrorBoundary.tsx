import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorMessage from './ui/ErrorMessage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4">
          <ErrorMessage
            title="Něco se pokazilo"
            message="Omlouváme se, ale v aplikaci nastala neočekávaná chyba. Zkuste stránku obnovit."
            variant="destructive"
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;