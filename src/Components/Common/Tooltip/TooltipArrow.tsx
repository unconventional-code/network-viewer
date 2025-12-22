import React from "react";
import classnames from "classnames";

type PlacementAxis = "top" | "bottom" | "left" | "right" | "center";

interface TooltipArrowProps {
  placementAxis?: PlacementAxis;
  [key: string]: any;
}

const getArrowPosition = (placement: PlacementAxis) =>
  classnames({
    "right-0": placement === "left",
    "left-0": placement === "right",
    "bottom-0": placement === "top",
    "top-0": placement === "bottom",
  });

const TooltipArrow: React.FC<TooltipArrowProps> = ({
  placementAxis = "bottom",
  ...props
}) => (
  <div
    className={classnames(
      "absolute w-2 h-2 bg-white-39 transform rotate-45",
      getArrowPosition(placementAxis)
    )}
    {...props}
  />
);

export default TooltipArrow;
