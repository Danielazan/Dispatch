import { ApiError } from '../utils/apiError.js';

export const requirePermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.adminUser) {
      throw new ApiError(401, 'Authentication required', { code: 'authentication_required' });
    }
    if (req.adminUser.isSuperAdmin || req.adminUser.permissions.includes(permissionKey)) {
      return next();
    }
    throw new ApiError(403, 'You do not have permission to perform this action', {
      code: 'permission_denied',
    });
  };
};