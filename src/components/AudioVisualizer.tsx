import { FC, useEffect, useRef } from "react";

interface PickItem {
  moveToY: number;
  lineToY: number;
}

interface AudioVisualiserProps {
  audioData: Uint8Array;
}

export const AudioVisualiser: FC<AudioVisualiserProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const picksRef = useRef<PickItem[]>([]);

  useEffect(() => {
    draw();
  }, [draw]);

  function draw() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.lineWidth = 1;
    context.strokeStyle = "#FFFFFF";
    context.clearRect(0, 0, width, height);

    context.beginPath();
    const maxPick = Math.max(...audioData);

    const picksLength = picksRef.current.length;
    const dynamicWidth = width / 2 - (width / 2 - picksLength);
    const sliceWidth = dynamicWidth / picksLength;

    let x = width / 2 - picksLength;
    for (const pick of picksRef.current) {
      context.moveTo(x, pick.moveToY);
      context.lineTo(x, pick.lineToY);
      // x = x + sliceWidth > width / 2 ? width / 2 : x + sliceWidth;
      x += sliceWidth;
    }
    context.stroke();
    context.closePath();

    const newPick = {
      moveToY: height - (maxPick / 255) * height,
      lineToY: (maxPick / 255) * height,
    };

    if (picksRef.current.length > width / 2) {
      picksRef.current.splice(0, 1);
    }
    picksRef.current.push(newPick);

    context.beginPath();
    context.strokeStyle = "#494848";
    context.moveTo(width / 2, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
  }

  return <canvas height="300" width={1600} ref={canvasRef} />;
};

// Draw line downwards
// context.moveTo(width / 2, height / 2);
// context.lineTo(width / 2, (maxPick / 255) * height);

// Draw line upwards
// context.moveTo(width / 2, height / 2);
// context.lineTo(width / 2, height - (maxPick / 255) * height);
