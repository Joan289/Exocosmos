import app from './app.js';

// Read port from environment, fallback to 1234
const PORT = process.env.PORT ?? '1234';

/**
 * Starts the Express server on the specified port.
 */
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
