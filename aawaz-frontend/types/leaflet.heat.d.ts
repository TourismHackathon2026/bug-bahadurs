declare module "leaflet.heat" {
  import type * as L from "leaflet"

  export interface HeatLayerOptions extends L.LayerOptions {
    minOpacity?: number
    maxZoom?: number
    max?: number
    radius?: number
    blur?: number
    gradient?: Record<number, string>
    pane?: string
  }

  export interface HeatLayer extends L.Layer {
    setOptions(options: HeatLayerOptions): this
    addLatLng(latlng: L.LatLngExpression): this
    setLatLngs(latlngs: L.LatLngExpression[]): this
    redraw(): this
  }

  export function heatLayer(
    latlngs: L.LatLngExpression[],
    options?: HeatLayerOptions,
  ): HeatLayer

  export default heatLayer
}
