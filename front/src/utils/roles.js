export const matchRole = (roles, requiredRoles) => (
  requiredRoles ? roles.some((role) => requiredRoles.includes(role)) : true
);
