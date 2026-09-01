export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'route_not_found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};