"use client";

import { type TypeSupport, TYPE_SUPPORT_META } from "../types";
import { getTypeSupportBadgeColor } from "../utils";

interface Props {
  typeSupport: TypeSupport;
  size?: "xs" | "sm";
}

export default function TypeSupportBadge({ typeSupport, size = "sm" }: Props) {
  const { label } = TYPE_SUPPORT_META[typeSupport];
  const colors = getTypeSupportBadgeColor(typeSupport);
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold ${textSize} ${colors}`}>
      {label}
    </span>
  );
}
