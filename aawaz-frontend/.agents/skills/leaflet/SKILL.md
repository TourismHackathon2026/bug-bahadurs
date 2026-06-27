### Installing Peer Dependencies

Source: https://react-leaflet.js.org/docs/start-installation

Install React, React DOM, and Leaflet as required peer dependencies.

```bash
npm install react@rc react-dom@rc leaflet  
```

```bash
pnpm add react@rc react-dom@rc leaflet  
```

--------------------------------

### Create Custom Control Component with Bare Specifier

Source: https://react-leaflet.js.org/docs/core-introduction

This example demonstrates creating custom Leaflet controls using bare specifier imports for `@react-leaflet/core` and `leaflet`. This is the standard approach when these packages are installed locally.

```javascript
import { createControlComponent } from '@react-leaflet/core'
import { Control } from 'leaflet'

export const ZoomControl = createControlComponent(
  (props) => new Control.Zoom(props),
)
```

--------------------------------

### Installing React Leaflet

Source: https://react-leaflet.js.org/docs/start-installation

Install the React Leaflet package using your preferred package manager.

```bash
npm install react-leaflet@next  
```

```bash
pnpm add react-leaflet@next  
```

--------------------------------

### Installing TypeScript Definitions

Source: https://react-leaflet.js.org/docs/start-installation

Add Leaflet type definitions to your project for TypeScript support.

```bash
npm install -D @types/leaflet  
```

```bash
pnpm add -D @types/leaflet  
```

--------------------------------

### CircleMarker with Center and Radius

Source: https://react-leaflet.js.org/docs/api-components

Example of a CircleMarker component. The `center` and `radius` props are mutable and managed by the CircleMarker behavior.

```jsx
<Circle center={[50.5, 30.5]} radius={200} />
```

--------------------------------

### Add Tooltips to Map Elements

Source: https://react-leaflet.js.org/docs/example-tooltips

This example shows how to attach tooltips to different Leaflet layers like Circle, CircleMarker, Marker, Polygon, and Rectangle. It includes examples of interactive tooltips that update on click and permanent, sticky, and positioned tooltips.

```jsx
const center = [51.505, -0.09]

const multiPolygon = [
  [
    [51.51, -0.12],
    [51.51, -0.13],
    [51.53, -0.13],
  ],
  [
    [51.51, -0.05],
    [51.51, -0.07],
    [51.53, -0.07],
  ],
]

const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
]

function TooltipCircle() {
  const [clickedCount, setClickedCount] = useState(0)
  const eventHandlers = useMemo(
    () => ({
      click() {
        setClickedCount((count) => count + 1)
      },
    }),
    [],
  )

  const clickedText = 
    clickedCount === 0
      ? 'Click this Circle to change the Tooltip text'
      : `Circle click: ${clickedCount}`

  return (
    <Circle
      center={center}
      eventHandlers={eventHandlers}
      pathOptions={{ fillColor: 'blue' }}
      radius={200}>
      <Tooltip>{clickedText}</Tooltip>
    </Circle>
  )
}

render(
  <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <TooltipCircle />
    <CircleMarker
      center={[51.51, -0.12] và
      pathOptions={{ color: 'red' }}
      radius={20}>
      <Tooltip>Tooltip for CircleMarker</Tooltip>
    </CircleMarker>
    <Marker position={[51.51, -0.09]}>
      <Popup>Popup for Marker</Popup>
      <Tooltip>Tooltip for Marker</Tooltip>
    </Marker>
    <Polygon pathOptions={{ color: 'purple' }} positions={multiPolygon}>
      <Tooltip sticky>sticky Tooltip for Polygon</Tooltip>
    </Polygon>
    <Rectangle bounds={rectangle} pathOptions={{ color: 'black' }}>
      <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
        permanent Tooltip for Rectangle
      </Tooltip>
    </Rectangle>
  </MapContainer>,
)
```

--------------------------------

### Import VideoOverlay from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the VideoOverlay component using a bare specifier from the installed react-leaflet package. This is the standard method for video overlay integration.

```javascript
import { VideoOverlay } from 'react-leaflet/VideoOverlay'
```

--------------------------------

### GeoJSON Layer with Attribution

Source: https://react-leaflet.js.org/docs/api-components

Example of using the GeoJSON layer with a mutable `attribution` prop. This prop is managed by the Attribution behavior.

```jsx
<GeoJSON attribution="&copy; credits due..." data={...} />
```

--------------------------------

### Import ImageOverlay from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the ImageOverlay component using a bare specifier from the installed react-leaflet package. This is the standard method for image overlay integration.

```javascript
import { ImageOverlay } from 'react-leaflet/ImageOverlay'
```

--------------------------------

### Import CircleMarker from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the CircleMarker component using a bare specifier from the installed react-leaflet package. This is the standard method for drawing circle markers.

```javascript
import { CircleMarker } from 'react-leaflet/CircleMarker'
```

--------------------------------

### Import WMSTileLayer from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the WMSTileLayer component using a bare specifier from the installed react-leaflet package. This is the standard method for WMS layer integration.

```javascript
import { WMSTileLayer } from 'react-leaflet/WMSTileLayer'
```

--------------------------------

### Circle with Path Options

Source: https://react-leaflet.js.org/docs/api-components

Applies styling to a Circle component using the `pathOptions` prop, which is mutable and managed by the Path behavior. This example sets the circle's color to blue.

```jsx
<Circle center={[50.5, 30.5]} radius={200} pathOptions={{ color: 'blue' }} />
```

--------------------------------

### Import TileLayer from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the TileLayer component using a bare specifier from the installed react-leaflet package. This is the standard method for project imports.

```javascript
import { TileLayer } from 'react-leaflet/TileLayer'
```

--------------------------------

### Import Circle from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the Circle component using a bare specifier from the installed react-leaflet package. This is the standard method for drawing circles.

```javascript
import { Circle } from 'react-leaflet/Circle'
```

--------------------------------

### Import Polyline from Local Package

Source: https://react-leaflet.js.org/docs/api-components

Import the Polyline component using a bare specifier from the installed react-leaflet package. This is the standard method for drawing polylines.

```javascript
import { Polyline } from 'react-leaflet/Polyline'
```

--------------------------------

### Basic React Leaflet Map with Marker

Source: https://react-leaflet.js.org/

Use this component to render a map with a tile layer and a popup. Ensure you have Leaflet and React Leaflet installed.

```jsx
const position = [51.505, -0.09]
        
render(
  <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
)
```

--------------------------------

### Implement Optimized Square Component in React Leaflet

Source: https://react-leaflet.js.org/docs/core-architecture

A complete example of a custom Square component that manages its own lifecycle and updates using React Leaflet context and hooks.

```javascript
import { useLeafletContext } from '@react-leaflet/core'  
import L from 'leaflet'  
import { useEffect, useRef } from 'react'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function Square(props) {  
  const context = useLeafletContext()  
  const squareRef = useRef()  
  const propsRef = useRef(props)  
  
  useEffect(() => {  
    squareRef.current = new L.Rectangle(getBounds(props))  
    const container = context.layerContainer || context.map  
    container.addLayer(squareRef.current)  
  
    return () => {  
      container.removeLayer(squareRef.current)  
    }  
  }, [])  
  
  useEffect(() => {  
    if (  
      props.center !== propsRef.current.center ||  
      props.size !== propsRef.current.size  
    ) {  
      squareRef.current.setBounds(getBounds(props))  
    }  
    propsRef.current = props  
  }, [props.center, props.size])  
  
  return null  
}  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000} />  
    </MapContainer>  
  )  
}
```

--------------------------------

### Create a Square Layer Component

Source: https://react-leaflet.js.org/docs/core-architecture

Use this component to add a square shape to the map. It requires center coordinates and a size. Ensure Leaflet and React-Leaflet are installed.

```jsx
import { useLeafletContext } from '@react-leaflet/core'  
import L from 'leaflet'  
import { useEffect } from 'react'  
  
function Square(props) {  
  const context = useLeafletContext()  
  
  useEffect(() => {  
    const bounds = L.latLng(props.center).toBounds(props.size)  
    const square = new L.Rectangle(bounds)  
    const container = context.layerContainer || context.map  
    container.addLayer(square)  
  
    return () => {  
      container.removeLayer(square)  
    }  
  })
  
  return null  
}  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000} />  
    </MapContainer>  
  )  
}
```

--------------------------------

### Implement Draggable Marker in React Leaflet

Source: https://react-leaflet.js.org/docs/example-draggable-marker

This component creates a draggable marker with a popup that allows toggling its draggable state. It uses `useState`, `useRef`, and `useMemo` hooks for managing state and event handlers. Ensure you have `react-leaflet` and `leaflet` installed.

```jsx
const center = {
  lat: 51.505,
  lng: -0.09,
}

function DraggableMarker() {
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(center)
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

render(
  <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <DraggableMarker />
  </MapContainer>,
)
```

--------------------------------

### Combine hooks for component creation

Source: https://react-leaflet.js.org/docs/core-architecture

Shows the manual combination of hooks to create a component before using higher-level factories.

```javascript
const useSquareElement = createElementHook(createSquare, updateSquare)  
const useSquare = createPathHook(useSquareElement)  
const Square = createContainerComponent(useSquare)  
```

--------------------------------

### Import Pane

Source: https://react-leaflet.js.org/docs/api-components

Demonstrates absolute and bare specifier import patterns for the Pane component.

```javascript
import { Pane } from 'https://cdn.esm.sh/react-leaflet/Pane'
```

```javascript
import { Pane } from 'react-leaflet/Pane'
```

--------------------------------

### Import ScaleControl

Source: https://react-leaflet.js.org/docs/api-components

Demonstrates absolute and bare specifier import patterns for the ScaleControl component.

```javascript
import { ScaleControl } from 'https://cdn.esm.sh/react-leaflet/ScaleControl'
```

```javascript
import { ScaleControl } from 'react-leaflet/ScaleControl'
```

--------------------------------

### Importing for TypeScript

Source: https://react-leaflet.js.org/docs/start-installation

Always import from the package entry-point to ensure TypeScript definitions are available.

```typescript
// ⚠️ No types available here  
import { MapContainer } from 'react-leaflet/MapContainer'  
  
// ✅ Types are available here  
import { MapContainer } from 'react-leaflet'  
```

--------------------------------

### TileLayer with Opacity and ZIndex

Source: https://react-leaflet.js.org/docs/api-components

Demonstrates setting `opacity` and `zIndex` for a TileLayer. These props are mutable and supported by the GridLayer behavior.

```jsx
<TileLayer url="..." opacity={0.5} zIndex={10} />
```

--------------------------------

### Tooltip Component

Source: https://react-leaflet.js.org/docs/api-components

Documentation for the Tooltip component, including its props and behaviors.

```APIDOC
## Tooltip

### Description
Represents a tooltip on the map.

### Parameters
#### Props
- **attribution** (string) - Optional - Mutable: Yes - Behavior: Attribution
- **children** (ReactNode) - Optional - Mutable: Yes - Behavior: ParentComponent
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Mutable: Yes - Behavior: Evented
- **pane** (string) - Optional - Mutable: No - Behavior: Pane
- **position** (LatLngExpression) - Optional - Mutable: Yes
```

--------------------------------

### Marker Component

Source: https://react-leaflet.js.org/docs/api-components

Documentation for the Marker component, including its props and behaviors.

```APIDOC
## Marker

### Description
Represents a marker on the map.

### Parameters
#### Props
- **attribution** (string) - Optional - Mutable: Yes - Behavior: Attribution
- **children** (ReactNode) - Optional - Mutable: Yes - Behavior: ParentComponent
- **draggable** (boolean) - Optional - Mutable: Yes
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Mutable: Yes - Behavior: Evented
- **icon** (Leaflet.Icon) - Optional - Mutable: Yes
- **opacity** (number) - Optional - Mutable: Yes
- **pane** (string) - Optional - Mutable: No - Behavior: Pane
- **position** (LatLngExpression) - Required - Mutable: Yes
- **zIndexOffset** (number) - Optional - Mutable: Yes
```

--------------------------------

### Import VideoOverlay from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the VideoOverlay component using an absolute specifier from a CDN. This is useful for overlaying video on the map via direct script inclusion.

```javascript
import { VideoOverlay } from 'https://cdn.esm.sh/react-leaflet/VideoOverlay'
```

--------------------------------

### Popup Component

Source: https://react-leaflet.js.org/docs/api-components

Documentation for the Popup component, including its props and behaviors.

```APIDOC
## Popup

### Description
Represents a popup on the map.

### Parameters
#### Props
- **attribution** (string) - Optional - Mutable: Yes - Behavior: Attribution
- **children** (ReactNode) - Optional - Mutable: Yes - Behavior: ParentComponent
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Mutable: Yes - Behavior: Evented
- **pane** (string) - Optional - Mutable: No - Behavior: Pane
- **position** (LatLngExpression) - Optional - Mutable: Yes
```

--------------------------------

### Implement Square using createPathComponent

Source: https://react-leaflet.js.org/docs/core-architecture

Uses the higher-level createPathComponent factory to simplify the creation of path-based components.

```javascript
import {  
  createElementObject,  
  createPathComponent,  
  extendContext,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  const square = new L.Rectangle(getBounds(props))  
  return createElementObject(  
    square,  
    extendContext(context, { overlayContainer: square }),  
  )  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const Square = createPathComponent(createSquare, updateSquare)  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000}>  
        <Popup>Hello Popup</Popup>  
      </Square>  
    </MapContainer>  
  )  
}  
```

--------------------------------

### Initialize custom element hook

Source: https://react-leaflet.js.org/docs/core-architecture

Creates a hook instance using the factory function.

```javascript
const useSquareElement = createElementHook(createSquare, updateSquare)  
```

--------------------------------

### Import useMap hook

Source: https://react-leaflet.js.org/docs/api-map

Imports for the useMap hook using absolute or bare specifiers.

```javascript
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'
```

```javascript
import { useMap } from 'react-leaflet/hooks'
```

--------------------------------

### Circle with Custom Pane

Source: https://react-leaflet.js.org/docs/api-components

Illustrates assigning a Circle to a specific pane using the `pane` prop. The pane must already exist.

```jsx
<Circle center={[50.5, 30.5]} radius={200} pane="my-existing-pane" />
```

--------------------------------

### Import Tooltip with Absolute Specifier

Source: https://react-leaflet.js.org/docs/api-components

Imports the Tooltip component using an absolute specifier from cdn.esm.sh.

```javascript
import { Tooltip } from 'https://cdn.esm.sh/react-leaflet/Tooltip'
```

--------------------------------

### Utilities and Context

Source: https://react-leaflet.js.org/docs/core-api

Utility functions for creating elements and managing React Leaflet context.

```APIDOC
## Utilities

### createElementObject
- **Arguments**: instance (T), context (LeafletContextInterface), container? (C)
- **Returns**: LeafletElement<T, C>

### extendContext
- **Arguments**: source (LeafletContextInterface), extra (Partial<LeafletContextInterface>)
- **Returns**: LeafletContextInterface

## Context

### useLeafletContext
- **Description**: React Hook returning the LeafletContext. Throws an error if context is not provided.
```

--------------------------------

### Import ImageOverlay from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the ImageOverlay component using an absolute specifier from a CDN. This is useful for overlaying images on the map via direct script inclusion.

```javascript
import { ImageOverlay } from 'https://cdn.esm.sh/react-leaflet/ImageOverlay'
```

--------------------------------

### Import WMSTileLayer from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the WMSTileLayer component using an absolute specifier from a CDN. This allows for WMS layer integration via direct script inclusion.

```javascript
import { WMSTileLayer } from 'https://cdn.esm.sh/react-leaflet/WMSTileLayer'
```

--------------------------------

### Marker with Click Event Handler

Source: https://react-leaflet.js.org/docs/api-components

Shows how to attach event listeners to a Marker using the `eventHandlers` prop. The `click` event handler logs a message to the console.

```jsx
<Marker
  position={[50.5, 30.5]}
  eventHandlers={{
    click: () => {
      console.log('marker clicked')
    },
  }}
/>
```

--------------------------------

### Simplify components with createLeafComponent

Source: https://react-leaflet.js.org/docs/core-architecture

Replaces manual component definitions with createLeafComponent, which automatically handles lifecycle logic and provides ref support for the Leaflet instance.

```javascript
import {  
  createElementHook,  
  createElementObject,  
  createLeafComponent,  
  createPathHook,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  return createElementObject(new L.Rectangle(getBounds(props)), context)  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const useSquareElement = createElementHook(createSquare, updateSquare)  
const useSquare = createPathHook(useSquareElement)  
const Square = createLeafComponent(useSquare)  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000} />  
    </MapContainer>  
  )  
}  
```

--------------------------------

### Use useMapEvents hook

Source: https://react-leaflet.js.org/docs/api-map

Attach multiple event handlers to the map instance.

```javascript
function MyComponent() {  
  const map = useMapEvents({  
    click: () => {  
      map.locate()  
    },  
    locationfound: (location) => {  
      console.log('location found:', location)  
    },  
  })  
  return null  
}  
  
function MyMapComponent() {  
  return (  
    <MapContainer center={[50.5, 30.5]} zoom={13}>  
      <MyComponent />  
    </MapContainer>  
  )  
}
```

--------------------------------

### Implement layer lifecycle with useLayerLifecycle

Source: https://react-leaflet.js.org/docs/core-architecture

Replaces manual useEffect logic for adding and removing layers with the specialized useLayerLifecycle hook.

```javascript
import {  
  createElementHook,  
  createElementObject,  
  useLayerLifecycle,  
  useLeafletContext,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  return createElementObject(new L.Rectangle(getBounds(props)), context)  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const useSquareElement = createElementHook(createSquare, updateSquare)  
  
function Square(props) {  
  const context = useLeafletContext()  
  const elementRef = useSquareElement(props, context)  
  useLayerLifecycle(elementRef.current, context)  
  
  return null  
}  
  
const center = [51.505, -0.09]  
  
render(  
  <MapContainer center={center} zoom={13}>  
    <TileLayer  
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
    />  
    <Square center={center} size={1000} />  
  </MapContainer>,  
)  
```

--------------------------------

### External State Management with MapContainer

Source: https://react-leaflet.js.org/docs/example-external-state

Sets up the Leaflet map container and conditionally renders the position display component once the map instance is available. Uses useMemo for efficient map container rendering.

```javascript
function ExternalStateExample() {
  const [map, setMap] = useState(null)

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    [],
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  )
}

render(<ExternalStateExample />)
```

--------------------------------

### Set up Map with Animated Panning Control

Source: https://react-leaflet.js.org/docs/example-animated-panning

This component sets up the MapContainer and includes the `SetViewOnClick` component. It manages the state for the animation toggle using `useRef`. Make sure to import `MapContainer`, `TileLayer`, and `useMapEvent` from `react-leaflet` and `useRef` from `react`.

```jsx
function AnimateExample() {
  const animateRef = useRef(false)

  return (
    <>
      <p>
        <label>
          <input
            type="checkbox"
            onChange={() => {
              animateRef.current = !animateRef.current
            }}
          />
          Animate panning
        </label>
      </p>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick animateRef={animateRef} />
      </MapContainer>
    </>
  )
}

render(<AnimateExample />)
```

--------------------------------

### Use useMapEvent hook

Source: https://react-leaflet.js.org/docs/api-map

Attach a single event handler to the map instance.

```javascript
function MyComponent() {  
  const map = useMapEvent('click', () => {  
    map.setView([50.5, 30.5], map.getZoom())  
  })  
  return null  
}  
  
function MyMapComponent() {  
  return (  
    <MapContainer center={[50.5, 30.5]} zoom={13}>  
      <MyComponent />  
    </MapContainer>  
  )  
}
```

--------------------------------

### WMSTileLayer Component

Source: https://react-leaflet.js.org/docs/api-components

Used to load and display WMS tile layers.

```APIDOC
## WMSTileLayer

### Description
Displays a WMS tile layer on the map.

### Props
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **opacity** (number) - Optional - GridLayer behavior
- **pane** (string) - Optional - Pane behavior
- **params** (WMSParams) - Optional - WMS parameters
- **url** (string) - Required - WMS URL
- **zIndex** (number) - Optional - GridLayer behavior
```

--------------------------------

### Import useMapEvent hook

Source: https://react-leaflet.js.org/docs/api-map

Imports for the useMapEvent hook using absolute or bare specifiers.

```javascript
import { useMapEvent } from 'https://cdn.esm.sh/react-leaflet/hooks'
```

```javascript
import { useMapEvent } from 'react-leaflet/hooks'
```

--------------------------------

### Import TileLayer from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the TileLayer component using an absolute specifier from a CDN. This is useful for direct script inclusion.

```javascript
import { TileLayer } from 'https://cdn.esm.sh/react-leaflet/TileLayer'
```

--------------------------------

### Import Popup with Absolute Specifier

Source: https://react-leaflet.js.org/docs/api-components

Imports the Popup component using an absolute specifier from cdn.esm.sh.

```javascript
import { Popup } from 'https://cdn.esm.sh/react-leaflet/Popup'
```

--------------------------------

### Define element creation and update functions

Source: https://react-leaflet.js.org/docs/core-architecture

Standalone functions that implement the expected interface for element lifecycle management.

```javascript
function createSquare(props, context) {  
  return createElementObject(new L.Rectangle(getBounds(props)), context)  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
```

--------------------------------

### VideoOverlay Component

Source: https://react-leaflet.js.org/docs/api-components

Used to display a video over a specific area of the map.

```APIDOC
## VideoOverlay

### Description
Displays a video overlay on the map.

### Props
- **attribution** (string) - Optional - Attribution
- **bounds** (LatLngBounds) - Required - MediaOverlay behavior
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **play** (boolean) - Optional - Play state
- **url** (string|string[]|HTMLVideoElement) - Required - Video source
- **zIndex** (number) - Optional - MediaOverlay behavior
```

--------------------------------

### DOM Interaction Utilities

Source: https://react-leaflet.js.org/docs/core-api

Utility functions for managing CSS classes on HTMLElements.

```APIDOC
## addClassName
Adds a class name to an HTMLElement.

## removeClassName
Removes a class name from an HTMLElement.

## updateClassName
Updates the class name of an HTMLElement based on previous and next values.
```

--------------------------------

### Manage Layer Lifecycle and Updates with useEffect

Source: https://react-leaflet.js.org/docs/core-architecture

Separates the mounting/unmounting logic from the update logic using dependency arrays in useEffect hooks.

```javascript
useEffect(() => {  
  squareRef.current = new L.Rectangle(getBounds(props))  
  const container = context.layerContainer || context.map  
  container.addLayer(squareRef.current)  
  
  return () => {  
    container.removeLayer(squareRef.current)  
  }  
}, [])  
  
useEffect(() => {  
  if (  
    props.center !== propsRef.current.center ||  
    props.size !== propsRef.current.size  
  ) {  
    squareRef.current.setBounds(getBounds(props))  
  }  
  propsRef.current = props  
}, [props.center, props.size])
```

--------------------------------

### Initialize Refs for Leaflet Instance and Props

Source: https://react-leaflet.js.org/docs/core-architecture

Use useRef to maintain references to the Leaflet layer instance and the previous props for comparison.

```javascript
const squareRef = useRef()  
const propsRef = useRef(props)
```

--------------------------------

### ImageOverlay with Bounds and Opacity

Source: https://react-leaflet.js.org/docs/api-components

Usage of the ImageOverlay component with mutable `bounds`, `opacity`, and `zIndex` props. The `bounds` are defined using `LatLngBounds`.

```javascript
const bounds = new LatLngBounds([40.712216, -74.22655], [40.773941, -74.12544])
```

```jsx
<ImageOverlay
  url="http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
  bounds={bounds}
  opacity={0.5}
  zIndex={10}
/>
```

--------------------------------

### Import CircleMarker from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the CircleMarker component using an absolute specifier from a CDN. This is useful for drawing circle markers on the map via direct script inclusion.

```javascript
import { CircleMarker } from 'https://cdn.esm.sh/react-leaflet/CircleMarker'
```

--------------------------------

### Import SVGOverlay Component

Source: https://react-leaflet.js.org/docs/api-components

Import the SVGOverlay component from React Leaflet.

```javascript
import { SVGOverlay } from 'https://cdn.esm.sh/react-leaflet/SVGOverlay'
```

```javascript
import { SVGOverlay } from 'react-leaflet/SVGOverlay'
```

--------------------------------

### Import MapContainer

Source: https://react-leaflet.js.org/docs/api-map

Imports for the MapContainer component using absolute or bare specifiers.

```javascript
import { MapContainer } from 'https://cdn.esm.sh/react-leaflet/MapContainer'
```

```javascript
import { MapContainer } from 'react-leaflet/MapContainer'
```

--------------------------------

### Import useMapEvents hook

Source: https://react-leaflet.js.org/docs/api-map

Imports for the useMapEvents hook using absolute or bare specifiers.

```javascript
import { useMapEvents } from 'https://cdn.esm.sh/react-leaflet/hooks'
```

```javascript
import { useMapEvents } from 'react-leaflet/hooks'
```

--------------------------------

### Create a custom component with createElementHook

Source: https://react-leaflet.js.org/docs/core-architecture

Uses the createElementHook factory to manage Leaflet element creation and updates, replacing manual useEffect logic.

```javascript
import {  
  createElementHook,  
  createElementObject,  
  useLeafletContext,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
import { useEffect } from 'react'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  return createElementObject(new L.Rectangle(getBounds(props)), context)  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const useSquareElement = createElementHook(createSquare, updateSquare)  
  
function Square(props) {  
  const context = useLeafletContext()  
  const elementRef = useSquareElement(props, context)  
  
  useEffect(() => {  
    const container = context.layerContainer || context.map  
    container.addLayer(elementRef.current.instance)  
  
    return () => {  
      container.removeLayer(elementRef.current.instance)  
    }  
  }, [])  
  
  return null  
}  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000} />  
    </MapContainer>  
  )  
}  
```

--------------------------------

### TileLayer Component

Source: https://react-leaflet.js.org/docs/api-components

Used to load and display tile layers on the map.

```APIDOC
## TileLayer

### Description
Displays a tile layer on the map.

### Props
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **opacity** (number) - Optional - GridLayer behavior
- **pane** (string) - Optional - Pane behavior
- **url** (string) - Required - Tile URL
- **zIndex** (number) - Optional - GridLayer behavior
```

--------------------------------

### Importing React Leaflet with Bundlers

Source: https://react-leaflet.js.org/docs/start-installation

Use bare specifiers for imports when working with a bundler like webpack.

```javascript
import { MapContainer } from 'react-leaflet/MapContainer'  
import { TileLayer } from 'react-leaflet/TileLayer'  
import { useMap } from 'react-leaflet/hooks'  
```

```javascript
import { MapContainer, TileLayer, useMap } from 'react-leaflet'  
```

--------------------------------

### Display Map Position and Reset Button

Source: https://react-leaflet.js.org/docs/example-external-state

Manages and displays the current map center coordinates. Includes a button to reset the map view to a predefined center and zoom level. Requires the map instance to be passed as a prop.

```javascript
const center = [51.505, -0.09]
const zoom = 13

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
    </p>
  )
}
```

--------------------------------

### Import Tooltip with Bare Specifier

Source: https://react-leaflet.js.org/docs/api-components

Imports the Tooltip component using a bare specifier, the standard import method for react-leaflet.

```javascript
import { Tooltip } from 'react-leaflet/Tooltip'
```

--------------------------------

### Import Polyline from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the Polyline component using an absolute specifier from a CDN. This is useful for drawing polylines on the map via direct script inclusion.

```javascript
import { Polyline } from 'https://cdn.esm.sh/react-leaflet/Polyline'
```

--------------------------------

### Render Marker with Popup

Source: https://react-leaflet.js.org/docs/api-components

Demonstrates nesting a Popup component within a Marker component. Ensure both are descendants of MapContainer.

```jsx
<Marker position={[50.5, 30.5]}>
  <Popup>Hello world</Popup>
</Marker>
```

--------------------------------

### Define Square using createContainerComponent

Source: https://react-leaflet.js.org/docs/core-architecture

Replaces the component factory with createContainerComponent to handle context and children rendering.

```javascript
const Square = createContainerComponent(useSquare)  
```

--------------------------------

### Import Marker with Absolute Specifier

Source: https://react-leaflet.js.org/docs/api-components

Imports the Marker component using an absolute specifier from cdn.esm.sh.

```javascript
import { Marker } from 'https://cdn.esm.sh/react-leaflet/Marker'
```

--------------------------------

### Import Circle from CDN

Source: https://react-leaflet.js.org/docs/api-components

Import the Circle component using an absolute specifier from a CDN. This is useful for drawing circles on the map via direct script inclusion.

```javascript
import { Circle } from 'https://cdn.esm.sh/react-leaflet/Circle'
```

--------------------------------

### Handle layer addition and removal

Source: https://react-leaflet.js.org/docs/core-architecture

Uses the element reference to manage layer lifecycle within a component.

```javascript
const elementRef = useSquareElement(props, context)  
  
useEffect(() => {  
  const container = context.layerContainer || context.map  
  container.addLayer(elementRef.current.instance)  
  
  return () => {  
    container.removeLayer(elementRef.current.instance)  
  }  
}, [])  
```

--------------------------------

### Importing React Leaflet via ESM

Source: https://react-leaflet.js.org/docs/start-installation

Use these imports when loading React Leaflet directly from a CDN like esm.sh.

```javascript
import { MapContainer } from 'https://cdn.esm.sh/react-leaflet/MapContainer'  
import { TileLayer } from 'https://cdn.esm.sh/react-leaflet/TileLayer'  
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'  
```

```javascript
import {  
  MapContainer,  
  TileLayer,  
  useMap,  
} from 'https://cdn.esm.sh/react-leaflet'  
```

--------------------------------

### ImageOverlay Component

Source: https://react-leaflet.js.org/docs/api-components

Used to display an image over a specific area of the map.

```APIDOC
## ImageOverlay

### Description
Displays an image overlay on the map.

### Props
- **attribution** (string) - Optional - Attribution
- **bounds** (LatLngBounds) - Required - MediaOverlay behavior
- **children** (ReactNode) - Optional - ParentComponent
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **opacity** (number) - Optional - MediaOverlay behavior
- **url** (string) - Required - Image URL
- **zIndex** (number) - Optional - MediaOverlay behavior
```

--------------------------------

### Implement a custom Square component with children support

Source: https://react-leaflet.js.org/docs/core-architecture

Defines a custom Square component that supports nested children by extending the context with an overlayContainer.

```javascript
import {  
  createContainerComponent,  
  createElementHook,  
  createElementObject,  
  createPathHook,  
  extendContext,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  const square = new L.Rectangle(getBounds(props))  
  return createElementObject(  
    square,  
    extendContext(context, { overlayContainer: square }),  
  )  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const useSquareElement = createElementHook(createSquare, updateSquare)  
const useSquare = createPathHook(useSquareElement)  
const Square = createContainerComponent(useSquare)  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000}>  
        <Popup>Hello Popup</Popup>  
      </Square>  
    </MapContainer>  
  )  
}  
```

--------------------------------

### MediaOverlayProps Interface Definition

Source: https://react-leaflet.js.org/docs/core-api

Props for MediaOverlay components, requiring bounds and supporting event handlers.

```typescript
interface MediaOverlayProps extends ImageOverlayOptions, EventedProps {
  bounds: LatLngBoundsExpression
}
```

--------------------------------

### Import AttributionControl Component

Source: https://react-leaflet.js.org/docs/api-components

Import the AttributionControl component from React Leaflet.

```javascript
import { AttributionControl } from 'https://cdn.esm.sh/react-leaflet/AttributionControl'
```

```javascript
import { AttributionControl } from 'react-leaflet/AttributionControl'
```

--------------------------------

### Import Popup with Bare Specifier

Source: https://react-leaflet.js.org/docs/api-components

Imports the Popup component using a bare specifier, the standard import method for react-leaflet.

```javascript
import { Popup } from 'react-leaflet/Popup'
```

--------------------------------

### Circle Component

Source: https://react-leaflet.js.org/docs/api-components

Used to draw a circle on the map.

```APIDOC
## Circle

### Description
Draws a circle on the map.

### Props
- **attribution** (string) - Optional - Attribution
- **center** (LatLngExpression) - Required - Center coordinates
- **children** (ReactNode) - Optional - ParentComponent
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **pane** (string) - Optional - Pane behavior
- **pathOptions** (PathOptions) - Optional - Path styling
- **radius** (number) - Required - Radius in meters
```

--------------------------------

### Implement a custom component with createPathHook

Source: https://react-leaflet.js.org/docs/core-architecture

Uses createPathHook to encapsulate element creation and update logic within a custom hook, which is then consumed by a functional component.

```javascript
import {  
  createElementHook,  
  createElementObject,  
  createPathHook,  
} from '@react-leaflet/core'  
import L from 'leaflet'  
  
function getBounds(props) {  
  return L.latLng(props.center).toBounds(props.size)  
}  
  
function createSquare(props, context) {  
  return createElementObject(new L.Rectangle(getBounds(props)), context)  
}  
  
function updateSquare(instance, props, prevProps) {  
  if (props.center !== prevProps.center || props.size !== prevProps.size) {  
    instance.setBounds(getBounds(props))  
  }  
}  
  
const useSquareElement = createElementHook(createSquare, updateSquare)  
const useSquare = createPathHook(useSquareElement)  
  
function Square(props) {  
  useSquare(props)  
  return null  
}  
  
const center = [51.505, -0.09]  
  
function MyMap() {  
  return (  
    <MapContainer center={center} zoom={13}>  
      <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
      />  
      <Square center={center} size={1000} />  
    </MapContainer>  
  )  
}  
```

--------------------------------

### Set Map Bounds with Clickable Rectangles

Source: https://react-leaflet.js.org/docs/example-view-bounds

Use this component to create clickable rectangles that fit the map to predefined bounds when clicked. Requires React and Leaflet hooks.

```jsx
const innerBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
]
const outerBounds = [
  [50.505, -29.09],
  [52.505, 29.09],
]

const redColor = { color: 'red' }
const whiteColor = { color: 'white' }

function SetBoundsRectangles() {
  const [bounds, setBounds] = useState(outerBounds)
  const map = useMap()

  const innerHandlers = useMemo(
    () => ({
      click() {
        setBounds(innerBounds)
        map.fitBounds(innerBounds)
      },
    }),
    [map],
  )
  const outerHandlers = useMemo(
    () => ({
      click() {
        setBounds(outerBounds)
        map.fitBounds(outerBounds)
      },
    }),
    [map],
  )

  return (
    <>
      <Rectangle
        bounds={outerBounds}
        eventHandlers={outerHandlers}
        pathOptions={bounds === outerBounds ? redColor : whiteColor}
      />
      <Rectangle
        bounds={innerBounds}
        eventHandlers={innerHandlers}
        pathOptions={bounds === innerBounds ? redColor : whiteColor}
      />
    </>
  )
}

render(
  <MapContainer bounds={outerBounds} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <SetBoundsRectangles />
  </MapContainer>,
)
```

--------------------------------

### Polyline Component

Source: https://react-leaflet.js.org/docs/api-components

Used to draw a polyline on the map.

```APIDOC
## Polyline

### Description
Draws a polyline on the map.

### Props
- **attribution** (string) - Optional - Attribution
- **children** (ReactNode) - Optional - ParentComponent
- **eventHandlers** (LeafletEventHandlerFnMap) - Optional - Evented behavior
- **pane** (string) - Optional - Pane behavior
- **pathOptions** (PathOptions) - Optional - Path styling
- **positions** (LatLngExpression[]|LatLngExpression[][]) - Required - Polyline coordinates
```