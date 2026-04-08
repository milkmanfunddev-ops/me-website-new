// Suppress unhandled rejections from convex-test scheduler
// The contact.submit mutation schedules an email action using "use node" runtime
// which can't run in the convex-test environment. The scheduled function
// failures are expected and don't affect test correctness.
process.on("unhandledRejection", (reason) => {
  const msg = String(reason);
  if (
    msg.includes("Write outside of transaction") ||
    msg.includes("handler is not a function") ||
    msg.includes("Could not find module")
  ) {
    // Expected: scheduled "use node" actions can't run in convex-test
    return;
  }
  // Re-throw unexpected rejections
  throw reason;
});
