export const isAdminUser = (user) => {
  if (!user || typeof user !== "object") {
    return false;
  }

  const candidateRoles = [
    user.role,
    user.userType,
    user.type,
    user.accountType,
    user.data?.role,
    user.data?.userType,
    user.maintainer?.role,
    user.maintainer?.user?.role,
  ];

  return candidateRoles.some(
    (candidateRole) =>
      typeof candidateRole === "string" &&
      candidateRole.trim().toLowerCase() === "admin"
  );
};

export const resolveUserPermissions = (user) => {
  if (!user || typeof user !== "object") {
    return {};
  }

  if (isAdminUser(user)) {
    return { "*": 999 };
  }

  const candidates = [
    user.permissions,
    user.permission,
    user.platformRole?.permissions,
    user.role?.permissions,
    user.roles?.[0]?.permissions,
    user.maintainer?.permissions,
    user.maintainer?.platformRole?.permissions,
    user.maintainer?.role?.permissions,
    user.maintainerAssignments?.[0]?.platformRole?.permissions,
    user.maintainers?.[0]?.platformRole?.permissions,
    user.membership?.platformRole?.permissions,
    user.data?.permissions,
    user.data?.platformRole?.permissions,
    user.data?.maintainer?.platformRole?.permissions,
  ];

  const matchedPermissions = candidates.find(
    (candidate) =>
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      Object.keys(candidate).length
  );

  return matchedPermissions || {};
};

export const hasPermissionAccess = (
  userPermissions,
  requiredPermissions,
  minimumLevel = 1
) => {
  if (Number(userPermissions?.["*"] || 0) >= minimumLevel) {
    return true;
  }

  if (!requiredPermissions) {
    return true;
  }

  const permissionList = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  return permissionList.some(
    (permissionKey) => Number(userPermissions?.[permissionKey] || 0) >= minimumLevel
  );
};

export const canAssignRole = (userPermissions, rolePermissions) => {
  if (Number(userPermissions?.["*"] || 0) > 0) {
    return true;
  }

  if (!rolePermissions || typeof rolePermissions !== "object") {
    return true;
  }

  const entries = Object.entries(rolePermissions);
  if (!entries.length) {
    return true;
  }

  return entries.every(([permissionKey, permissionLevel]) => {
    const allowedLevel = Number(userPermissions?.[permissionKey] || 0);
    const requestedLevel = Number(permissionLevel || 0);
    return allowedLevel >= requestedLevel;
  });
};
