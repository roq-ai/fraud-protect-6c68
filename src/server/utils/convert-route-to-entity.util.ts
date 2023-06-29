const mapping: Record<string, string> = {
  clients: 'client',
  'phone-numbers': 'phone_number',
  'spoof-calls': 'spoof_call',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
