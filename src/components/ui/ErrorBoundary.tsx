import { Component, type ErrorInfo, type ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
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
        <div className="flex items-center justify-center min-h-[400px] w-full p-6">
          <GlassPanel className="border-red-400/50 max-w-lg w-full text-center">
            <h2 className="text-xl text-red-400 font-display mb-4">Diagnostic Failure</h2>
            <p className="text-foam-white/80 font-mono text-sm mb-4">
              {this.props.fallbackMessage || 'The subsystem encountered a critical error.'}
            </p>
            <div className="text-left bg-deep-navy/50 p-4 rounded text-xs font-mono text-red-400/80 overflow-auto max-h-32">
              {this.state.error?.message}
            </div>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}
