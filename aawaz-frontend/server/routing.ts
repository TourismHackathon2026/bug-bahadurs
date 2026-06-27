// ★ Strategy pattern — category → authority routing
import { ComplaintCategory, AuthorityType } from "@/lib/constants"

export const routingStrategies: Record<ComplaintCategory, AuthorityType> = {
  TAXI_FRAUD: "TRAFFIC_POLICE",
  HOTEL_ISSUE: "HOTEL_ASSOCIATION",
  TREKKING_SAFETY: "TOURISM_BOARD",
  OVERCHARGING: "TOURISM_BOARD",
  HARASSMENT: "NEPAL_POLICE",
  THEFT: "NEPAL_POLICE",
  OTHER: "MUNICIPALITY",
}

/**
 * Route a complaint category to the correct authority type using Strategy pattern
 */
export function routeComplaint(category: ComplaintCategory): AuthorityType {
  const authority = routingStrategies[category]
  if (!authority) {
    return "MUNICIPALITY"
  }
  return authority
}
