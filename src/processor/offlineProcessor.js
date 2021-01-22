export default function OfflineProcessor() {
    return {
      start: callback => {
        setImmediate(callback, null); // Deferring start() callback
      },
      close: () => {},
    };
  }