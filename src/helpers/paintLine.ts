import { PaintLineParams } from "../types/types.ts";

export const paintLine = ({ context, color, x, y, w, h }: PaintLineParams) => {
  context.fillStyle = color;
  context.beginPath();

  if (context.roundRect) {
    // making sure roundRect is supported by the browser
    context.roundRect(x, y, w, h, 50);
    context.fill();
  } else {
    // fallback for browsers that do not support roundRect
    context.fillRect(x, y, w, h);
  }
};
