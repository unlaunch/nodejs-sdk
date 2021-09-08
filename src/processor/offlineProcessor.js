const OfflineProcessor = () => {
  return {
    start: callback => {
      setImmediate(callback, null); // Deferring start() callback
    },
    close: () => { },
  };
}

module.exports = {
  OfflineProcessor
}