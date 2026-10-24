import React, { Component } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

/**
 * React Error Boundary
 * Catches unhandled exceptions anywhere in the child component tree
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
    if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="card-glass max-w-lg w-full rounded-3xl p-8 border border-rose-300 dark:border-rose-900 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Something went unexpectedly wrong
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We encountered an issue rendering this celebration view. Your saved data remains
                safe.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md hover:from-amber-700 hover:to-rose-700 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
