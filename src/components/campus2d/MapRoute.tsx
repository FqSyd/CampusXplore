import React from 'react';

export interface MapRouteProps {
  routePointsString: string;
  isMinimap?: boolean;
}

export const MapRoute: React.FC<MapRouteProps> = ({
  routePointsString,
  isMinimap = false,
}) => {
  if (!routePointsString) return null;

  return (
    <g name="a-star-calculated-route">
      {/* Outer Glow */}
      <polyline
        points={routePointsString}
        fill="none"
        stroke="#06B6D4"
        strokeWidth={isMinimap ? 4 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#route-glow)"
        opacity="0.6"
      />
      {/* Core Bright Path */}
      <polyline
        points={routePointsString}
        fill="none"
        stroke="#22D3EE"
        strokeWidth={isMinimap ? 2.5 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

export default MapRoute;
