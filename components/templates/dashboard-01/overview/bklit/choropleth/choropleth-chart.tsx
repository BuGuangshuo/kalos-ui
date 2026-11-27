"use client";

import type { FeatureCollection, GeoJSON, Geometry } from "geojson";
import type { Transition } from "motion/react";
import { domAnimation, LazyMotion } from "motion/react";
import React, {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ParentSize } from "../chart-parent-size";
import { ChoroplethBackground as ChoroplethBackgroundLayer } from "./choropleth-background";
import {
  ChoroplethCameraContext,
  type ChoroplethCameraController,
  type ChoroplethPerspective,
  type ChoroplethZoomTransition,
  useChoroplethCameraController,
} from "./choropleth-camera";
import {
  type ChoroplethFeature,
  type ChoroplethFeatureProperties,
  ChoroplethInteractionShell,
  ChoroplethStableProvider,
  ChoroplethZoomContext,
  type Margin,
  useChoroplethInteraction,
  type ZoomInstance,
} from "./choropleth-context";
import { ChoroplethDotGrid as ChoroplethDotGridLayer } from "./choropleth-dot-grid";
import { ChoroplethFeature as ChoroplethFeatureLayer } from "./choropleth-feature";
import { ChoroplethGraticule as ChoroplethGraticuleLayer } from "./choropleth-graticule";
import { ChoroplethMarker as ChoroplethMarkerLayer } from "./choropleth-marker";
import {
  type ChoroplethMercator,
  createChoroplethMercator,
  projectFeaturePaths,
} from "./choropleth-projection";
import { ChoroplethTooltip as ChoroplethTooltipLayer } from "./choropleth-tooltip";
import {
  choroplethWheelDelta,
  type TransformMatrix,
} from "./choropleth-zoom-matrix";
import { useChoroplethZoomState } from "./use-choropleth-zoom-state";

export interface ChoroplethChartProps {
  /** GeoJSON FeatureCollection data */
  data: FeatureCollection<Geometry, ChoroplethFeatureProperties>;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Animation duration in milliseconds. Default: 800 */
  animationDuration?: number;
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Signature of motion URL state — triggers enter replay when it changes. */
  revealSignature?: string;
  /** Aspect ratio as "width / height". Default: "16 / 9" */
  aspectRatio?: string;
  /** Projection scale. If not provided, auto-calculated based on width */
  scale?: number;
  /** Center coordinates [longitude, latitude]. Default: [0, 20] */
  center?: [number, number];
  /** Translate offset [x, y]. If not provided, auto-calculated to center */
  translate?: [number, number];
  /** Enable zoom and pan. Default: false */
  zoomEnabled?: boolean;
  /** Minimum zoom scale. Default: 0.5 */
  zoomMin?: number;
  /** Maximum zoom scale. Default: 4 */
  zoomMax?: number;
  /** Initial zoom transform */
  initialZoom?: TransformMatrix;
  /**
   * Click a region or marker to fly the camera to it; click it again, the
   * empty map, or press Escape to fly back. Default: false
   */
  clickToZoom?: boolean;
  /** Maximum camera scale when focusing a region. Default: 6 */
  focusMaxZoom?: number;
  /** Duration and easing of the click-to-zoom flight (and camera angle change). */
  zoomTransition?: ChoroplethZoomTransition;
  /**
   * 3D camera: a view for the zoomed-out map and one for a focused region,
   * e.g. flat overview that swings to look from the east when you zoom in.
   */
  perspective?: ChoroplethPerspective;
  /** Additional class name for the container */
  className?: string;
  /** Child components (ChoroplethFeature, ChoroplethGraticule, ChoroplethTooltip) */
  children: ReactNode;
}

const DEFAULT_MARGIN: Margin = { top: 0, right: 0, bottom: 0, left: 0 };

// Known SVG component displayNames
const SVG_COMPONENT_NAMES = new Set([
  "ChoroplethFeature",
  "ChoroplethGraticule",
  "ChoroplethTooltip",
  "ChoroplethDotGrid",
  "ChoroplethMarker",
]);

const SVG_COMPONENT_TYPES = new Set<unknown>([
  ChoroplethFeatureLayer,
  ChoroplethGraticuleLayer,
  ChoroplethTooltipLayer,
  ChoroplethDotGridLayer,
  ChoroplethMarkerLayer,
]);

// Static layers drawn behind the map: they don't zoom or tilt.
const BACKDROP_COMPONENT_NAMES = new Set(["ChoroplethBackground"]);
const BACKDROP_COMPONENT_TYPES = new Set<unknown>([ChoroplethBackgroundLayer]);

function isChoroplethBackdropChild(type: unknown): boolean {
  if (
    BACKDROP_COMPONENT_TYPES.has(type) ||
    BACKDROP_COMPONENT_TYPES.has(resolveComponentType(type))
  ) {
    return true;
  }
  const displayName = getComponentDisplayName(type);
  return displayName !== null && BACKDROP_COMPONENT_NAMES.has(displayName);
}

function resolveComponentType(type: unknown): unknown {
  if (
    typeof type === "object" &&
    type !== null &&
    "type" in type &&
    (type as { type?: unknown }).type
  ) {
    return (type as { type: unknown }).type;
  }
  return type;
}

function getComponentDisplayName(type: unknown): string | null {
  if (typeof type === "function") {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName ?? fn.name ?? null;
  }
  if (typeof type === "object" && type !== null) {
    const wrapped = type as {
      displayName?: string;
      type?: { displayName?: string; name?: string };
    };
    if (wrapped.displayName) {
      return wrapped.displayName;
    }
    const inner = wrapped.type;
    if (typeof inner === "function") {
      const innerFn = inner as { displayName?: string; name?: string };
      return innerFn.displayName ?? innerFn.name ?? null;
    }
  }
  return null;
}

function isChoroplethSvgChild(type: unknown): boolean {
  if (SVG_COMPONENT_TYPES.has(type)) {
    return true;
  }
  const resolved = resolveComponentType(type);
  if (resolved !== type && SVG_COMPONENT_TYPES.has(resolved)) {
    return true;
  }
  const displayName = getComponentDisplayName(type);
  return displayName !== null && SVG_COMPONENT_NAMES.has(displayName);
}

// HTML elements that should render in overlay layer
const HTML_ELEMENTS = new Set(["div", "span", "button", "p", "a"]);

// Separate children into SVG and overlay layers
function separateChildren(children: ReactNode): {
  backdropChildren: React.ReactNode[];
  svgChildren: React.ReactNode[];
  overlayChildren: React.ReactNode[];
} {
  const childArray = React.Children.toArray(children);
  const backdropChildren: React.ReactNode[] = [];
  const svgChildren: React.ReactNode[] = [];
  const overlayChildren: React.ReactNode[] = [];

  for (const child of childArray) {
    if (!React.isValidElement(child)) {
      svgChildren.push(child);
      continue;
    }

    if (isChoroplethBackdropChild(child.type)) {
      backdropChildren.push(child);
    } else if (isChoroplethSvgChild(child.type)) {
      svgChildren.push(child);
    } else if (typeof child.type === "string") {
      if (HTML_ELEMENTS.has(child.type)) {
        overlayChildren.push(child);
      } else {
        svgChildren.push(child);
      }
    } else {
      overlayChildren.push(child);
    }
  }

  return { backdropChildren, svgChildren, overlayChildren };
}

const DEFAULT_INITIAL_ZOOM: TransformMatrix = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

interface ChoroplethMercatorContentProps {
  mercator: ChoroplethMercator;
  featurePaths: readonly (string | null)[];
  data: FeatureCollection<Geometry, ChoroplethFeatureProperties>;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  animationDuration: number;
  enterTransition?: Transition;
  revealEpoch: number;
  isLoaded: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  backdropChildren: React.ReactNode[];
  svgChildren: React.ReactNode[];
  overlayChildren: React.ReactNode[];
  zoom?: ZoomInstance<SVGSVGElement>;
  cameraOptions: CameraOptions;
}

interface CameraOptions {
  clickToZoom: boolean;
  focusMaxZoom: number;
  zoomTransition?: ChoroplethZoomTransition;
  perspective?: ChoroplethPerspective;
}

function fadeStops(edge: number, active: boolean) {
  const outer = active ? 0 : 1;
  return [
    { offset: "0%", opacity: outer },
    { offset: `${edge}%`, opacity: 1 },
    { offset: `${100 - edge}%`, opacity: 1 },
    { offset: "100%", opacity: outer },
  ];
}

/** Horizontal × vertical edge fade in the svg's own (untransformed) space. */
function ViewportFadeMask({
  id,
  width,
  height,
  edgeFade,
  active,
}: {
  id: string;
  width: number;
  height: number;
  edgeFade: number;
  active: boolean;
}) {
  const stops = fadeStops(edgeFade, active);
  // stop-opacity is a CSS property, so the fade eases in as the camera moves.
  const stopNodes = stops.map((stop) => (
    <stop
      key={stop.offset}
      offset={stop.offset}
      stopColor="white"
      style={{
        stopOpacity: stop.opacity,
        transition: "stop-opacity 0.4s ease-out",
      }}
    />
  ));
  return (
    <defs>
      <linearGradient id={`${id}-h`} x1="0" x2="1" y1="0" y2="0">
        {stopNodes}
      </linearGradient>
      <linearGradient id={`${id}-v`} x1="0" x2="0" y1="0" y2="1">
        {stopNodes}
      </linearGradient>
      <mask
        height={height}
        id={`${id}-hm`}
        maskUnits="userSpaceOnUse"
        width={width}
        x={0}
        y={0}
      >
        <rect fill={`url(#${id}-h)`} height={height} width={width} />
      </mask>
      <mask
        height={height}
        id={id}
        maskUnits="userSpaceOnUse"
        width={width}
        x={0}
        y={0}
      >
        <g mask={`url(#${id}-hm)`}>
          <rect fill={`url(#${id}-v)`} height={height} width={width} />
        </g>
      </mask>
    </defs>
  );
}

const ChoroplethSvg = memo(function ChoroplethSvg({
  height, width, svgChildren, zoom, api, svgRef, cameraRef, edgeFade, edgeFadeActive,
}: {
  height: number;
  width: number;
  svgChildren: React.ReactNode[];
  zoom?: ZoomInstance<SVGSVGElement>;
} & Pick<ChoroplethCameraController, "api" | "svgRef" | "cameraRef" | "edgeFade" | "edgeFadeActive">) {
  const { setHoveredFeatureIndex, setTooltipData, setMarkerTooltip } =
    useChoroplethInteraction();
  const fadeId = `choropleth-edge-fade-${useId().replace(/:/g, "")}`;


  const handleMouseLeave = useCallback(() => {
    setHoveredFeatureIndex(null);
    setTooltipData(null);
    setMarkerTooltip?.(null);
  }, [setHoveredFeatureIndex, setTooltipData, setMarkerTooltip]);

  // The zoom gesture listener and camera controls share this SVG element.
  useImperativeHandle<SVGSVGElement | null, SVGSVGElement | null>(zoom?.containerRef ?? null, () => svgRef.current, [svgRef]);

  // Clicking empty map (not a region or marker) flies back out.
  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (
        api.enabled &&
        api.focusedKey !== null &&
        event.target === event.currentTarget &&
        !api.wasDrag()
      ) {
        api.reset();
      }
    },
    [api]
  );

  let cursor: string | undefined;
  if (zoom) {
    cursor = zoom.isDragging ? "grabbing" : "grab";
  }

  return (
    <svg
      aria-hidden={api.enabled ? undefined : true}
      role={api.enabled ? "group" : undefined}
      height={height}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      ref={svgRef}
      style={{
        // Draws past its own box: the tilted plane would otherwise show the
        // svg edge as a slanted cut. The untransformed wrapper clips instead.
        contain: "layout style",
        overflow: "visible",
        cursor,
        touchAction: zoom ? "none" : "manipulation",
      }}
      width={width}
    >
      {edgeFade > 0 ? (
        <ViewportFadeMask
          active={edgeFadeActive}
          edgeFade={edgeFade}
          height={height}
          id={fadeId}
          width={width}
        />
      ) : null}
      {/* Mask lives outside the camera, so it stays on the chart's edges. */}
      <g mask={edgeFade > 0 ? `url(#${fadeId})` : undefined}>
        <g ref={cameraRef}>
          <g
            style={{
              transition: zoom?.isDragging
                ? "none"
                : "transform 0.18s ease-out",
            }}
            transform={zoom ? zoom.toString() : undefined}
          >
            {svgChildren}
          </g>
        </g>
      </g>
    </svg>
  );
});

const ChoroplethMercatorContent = memo(function ChoroplethMercatorContent({
  mercator,
  featurePaths,
  data,
  width,
  height,
  innerWidth,
  innerHeight,
  margin,
  animationDuration,
  enterTransition,
  revealEpoch,
  isLoaded,
  containerRef,
  backdropChildren,
  svgChildren,
  overlayChildren,
  zoom,
  cameraOptions,
}: ChoroplethMercatorContentProps) {
  const {
    api, cameraRef, svgRef, planeRef, hasPerspective, depth, edgeFade, edgeFadeActive,
    onPointerDown, onPointerMove, onPointerLeave,
  } = useChoroplethCameraController({
    ...cameraOptions,
    width,
    height,
    mercator,
    features: data.features,
    onBeforeFocus: zoom?.reset,
  });

  const pathGenerator = useCallback(
    (feature: ChoroplethFeature) => mercator.path(feature) ?? undefined,
    [mercator]
  );

  const rawPathGenerator = useCallback(
    (geo: GeoJSON) => mercator.path(geo),
    [mercator]
  );

  const projectPoint = useCallback(
    (coords: [number, number]): [number, number] | null => {
      const projected = mercator.projection(coords);
      if (!projected) {
        return null;
      }
      return projected as [number, number];
    },
    [mercator]
  );

  const stableValue = useMemo(
    () => ({
      features: data.features,
      featureCollection: data,
      featurePaths,
      pathGenerator,
      rawPathGenerator,
      projectPoint,
      width,
      height,
      innerWidth,
      innerHeight,
      margin,
      containerRef,
      isLoaded,
      animationDuration,
      enterTransition,
      revealEpoch,
    }),
    [
      animationDuration,
      containerRef,
      data,
      enterTransition,
      featurePaths,
      height,
      innerHeight,
      innerWidth,
      isLoaded,
      margin,
      pathGenerator,
      projectPoint,
      rawPathGenerator,
      revealEpoch,
      width,
    ]
  );

  return (
    <ChoroplethZoomContext.Provider value={{ zoom: zoom ?? null }}>
      <ChoroplethCameraContext.Provider value={api}>
        <ChoroplethStableProvider value={stableValue}>
          <ChoroplethInteractionShell>
            <div
              className="relative h-full w-full"
              onPointerDown={onPointerDown}
              onPointerLeave={onPointerLeave}
              onPointerMove={onPointerMove}
              ref={containerRef}
            >
              {backdropChildren.length > 0 ? (
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  height={height}
                  width={width}
                >
                  {backdropChildren}
                </svg>
              ) : null}
              {/* Clip box: never transformed, so the map is cut by the chart frame. */}
              <div
                className="relative h-full w-full"
                // Inline so wrappers that force `overflow: visible` on
                // descendants (e.g. gallery frames) can't undo the clip.
                // Paint containment also clips composited layers.
                style={{
                  contain: "paint",
                  overflow: "hidden",
                  perspective: hasPerspective
                    ? `${depth}px`
                    : undefined,
                }}
              >
                <div
                  className="h-full w-full"
                  ref={planeRef}
                  style={{
                    transformOrigin: "50% 60%",
                    // A tilt that changes every frame otherwise makes Chrome
                    // drop to a low-res raster until the motion settles.
                    willChange: hasPerspective ? "transform" : undefined,
                  }}
                >
                  <ChoroplethSvg
                    api={api}
                    cameraRef={cameraRef}
                    svgRef={svgRef}
                    edgeFade={edgeFade}
                    edgeFadeActive={edgeFadeActive}
                    height={height}
                    svgChildren={svgChildren}
                    width={width}
                    zoom={zoom}
                  />
                </div>
              </div>
              {overlayChildren}
            </div>
          </ChoroplethInteractionShell>
        </ChoroplethStableProvider>
      </ChoroplethCameraContext.Provider>
    </ChoroplethZoomContext.Provider>
  );
});

/** Owns the zoom state (replaces visx `<Zoom>`'s render prop). */
function ChoroplethZoom({
  width,
  height,
  initialTransformMatrix,
  scaleMin,
  scaleMax,
  children,
}: {
  width: number;
  height: number;
  initialTransformMatrix: TransformMatrix;
  scaleMin: number;
  scaleMax: number;
  children: (zoom: ZoomInstance<SVGSVGElement>) => ReactNode;
}) {
  const zoom = useChoroplethZoomState<SVGSVGElement>({
    width,
    height,
    initialTransformMatrix,
    scaleXMin: scaleMin,
    scaleXMax: scaleMax,
    scaleYMin: scaleMin,
    scaleYMax: scaleMax,
    wheelDelta: choroplethWheelDelta,
  });
  return children(zoom);
}

function ChoroplethChartInner({
  data,
  width,
  height,
  margin: marginProp,
  animationDuration,
  enterTransition,
  revealSignature = "",
  scale: scaleProp,
  center,
  translate: translateProp,
  zoomEnabled,
  zoomMin,
  zoomMax,
  initialZoom,
  cameraOptions,
  children,
}: {
  cameraOptions: CameraOptions;
  data: FeatureCollection<Geometry, ChoroplethFeatureProperties>;
  width: number;
  height: number;
  margin: Margin;
  animationDuration: number;
  enterTransition?: Transition;
  revealSignature?: string;
  scale?: number;
  center: [number, number];
  translate?: [number, number];
  zoomEnabled: boolean;
  zoomMin: number;
  zoomMax: number;
  initialZoom: TransformMatrix;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [revealEpoch, setRevealEpoch] = useState(1);

  // ChoroplethChart spreads a fresh margin object every render; key it on
  // its values so the memoized content and stable context survive.
  const margin = useMemo(
    () => ({
      top: marginProp.top,
      right: marginProp.right,
      bottom: marginProp.bottom,
      left: marginProp.left,
    }),
    [marginProp.top, marginProp.right, marginProp.bottom, marginProp.left]
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const scale = scaleProp ?? (innerWidth / 630) * 100;

  const translateX = translateProp?.[0] ?? innerWidth / 2 + margin.left;
  const translateY = translateProp?.[1] ?? innerHeight / 2 + margin.top + 50;
  const [centerX, centerY] = center;

  // Projection + per-feature paths, recomputed only when their inputs change
  // (visx <Mercator> rebuilt both on every render).
  const mercator = useMemo(
    () =>
      createChoroplethMercator({
        scale,
        translate: [translateX, translateY],
        center: [centerX, centerY],
      }),
    [scale, translateX, translateY, centerX, centerY]
  );
  const featurePaths = useMemo(
    () => projectFeaturePaths(mercator, data.features),
    [mercator, data.features]
  );

  const { backdropChildren, svgChildren, overlayChildren } = useMemo(
    () => separateChildren(children),
    [children]
  );

  // Replay the reveal when motion settings change. Adjusted during render
  // ("store previous props in state") instead of setState in an effect, so a
  // replay costs one render rather than a commit plus a cascading re-render.
  const [revealKey, setRevealKey] = useState({
    animationDuration,
    revealSignature,
  });
  if (
    revealKey.animationDuration !== animationDuration ||
    revealKey.revealSignature !== revealSignature
  ) {
    setRevealKey({ animationDuration, revealSignature });
    setRevealEpoch((n) => n + 1);
    setIsLoaded(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: revealSignature
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, animationDuration);
    return () => clearTimeout(timeout);
  }, [animationDuration, revealSignature]);

  if (width < 10 || height < 10) {
    return null;
  }

  const mercatorContentProps = {
    animationDuration,
    backdropChildren,
    cameraOptions,
    containerRef,
    data,
    enterTransition,
    height,
    innerHeight,
    innerWidth,
    isLoaded,
    margin,
    overlayChildren,
    revealEpoch,
    svgChildren,
    width,
  };

  const content = (zoom?: ZoomInstance<SVGSVGElement>) => (
    <ChoroplethMercatorContent
      {...mercatorContentProps}
      featurePaths={featurePaths}
      mercator={mercator}
      zoom={zoom}
    />
  );

  if (zoomEnabled) {
    return (
      <ChoroplethZoom
        height={height}
        initialTransformMatrix={initialZoom}
        scaleMax={zoomMax}
        scaleMin={zoomMin}
        width={width}
      >
        {content}
      </ChoroplethZoom>
    );
  }

  return content();
}

export function ChoroplethChart({
  data,
  margin: marginProp,
  animationDuration = 800,
  enterTransition,
  revealSignature,
  aspectRatio = "16 / 9",
  scale,
  center = [0, 20],
  translate,
  zoomEnabled = false,
  zoomMin = 0.5,
  zoomMax = 4,
  initialZoom = DEFAULT_INITIAL_ZOOM,
  clickToZoom = false,
  focusMaxZoom = 6,
  zoomTransition,
  perspective,
  className = "",
  children,
}: ChoroplethChartProps) {
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  const cameraOptions = useMemo<CameraOptions>(
    () => ({ clickToZoom, focusMaxZoom, zoomTransition, perspective }),
    [clickToZoom, focusMaxZoom, zoomTransition, perspective]
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("relative w-full", className)} style={{ aspectRatio }}>
        <ParentSize debounceTime={10}>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <ChoroplethChartInner
                animationDuration={animationDuration}
                cameraOptions={cameraOptions}
                center={center}
                data={data}
                enterTransition={enterTransition}
                height={height}
                initialZoom={initialZoom}
                margin={margin}
                revealSignature={revealSignature}
                scale={scale}
                translate={translate}
                width={width}
                zoomEnabled={zoomEnabled}
                zoomMax={zoomMax}
                zoomMin={zoomMin}
              >
                {children}
              </ChoroplethChartInner>
            ) : null
          }
        </ParentSize>
      </div>
    </LazyMotion>
  );
}

ChoroplethChart.displayName = "ChoroplethChart";

export default ChoroplethChart;
