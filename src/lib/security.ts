export function canDiscover(unlockAfter: number, discoveredCount: number) {
  return unlockAfter <= discoveredCount;
}

export function isAdmin(role: string | undefined) {
  return role === 'ADMIN';
}
