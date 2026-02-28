declare module "react-simple-maps" {
  import {
    ComponentType,
    SVGProps,
    ReactNode,
    CSSProperties,
    MouseEvent,
  } from "react";

  interface ProjectionConfig {
    rotate?: [number, number, number];
    center?: [number, number];
    scale?: number;
  }

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveStart?: (event: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (event: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (event: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  interface GeographyProps {
    geography: GeographyType;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onClick?: (event: MouseEvent) => void;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  }

  interface GeographyType {
    type: string;
    id?: string;
    properties: {
      name: string;
      [key: string]: string;
    };
    geometry: object;
    rsmKey: string;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: GeographyType[] }) => ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
