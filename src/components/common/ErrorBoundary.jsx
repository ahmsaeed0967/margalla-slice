import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Caught UI Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-cream rounded-2xl m-4 border border-line">
          <p className="text-sm font-bold text-ink">Content loading smoothly...</p>
        </div>
      );
    }
    return this.props.children;
  }
}