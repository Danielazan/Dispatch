import { ZodError } from 'zod';

export const formatZodDetails = (issues) => {
  return issues.flatMap((issue) => {
    if (issue.code === 'unrecognized_keys' && Array.isArray(issue.keys)) {
      return issue.keys.map((key) => ({
        path: [...issue.path, key].join('.'),
        message: `Unrecognized key: '${key}'`,
      }));
    }
    return [{ path: issue.path.join('.'), message: issue.message }];
  });
};

export const validate = ({ body, query, params } = {}) => {
  return (req, res, next) => {
    try {
      if (params) {
        req.params = params.parse(req.params);
      }
      if (query) {
        req.query = query.parse(req.query);
      }
      if (body) {
        req.body = body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'validation_error',
            message: 'Request validation failed',
            details: formatZodDetails(error.issues),
          },
        });
      }
      next(error);
    }
  };
};