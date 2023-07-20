import { FC, useRef } from "react";

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

  function draw() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext("2d");
    if (!context) return;

    if (audioData.length) {
      const maxPick = Math.max(...audioData);
      const picksLength = picksRef.current.length;
      const newPick = {
        moveToY: height - (maxPick / 255) * height,
        lineToY: (maxPick / 255) * height,
      };

      if (picksRef.current.length > width / 2) {
        picksRef.current.shift();
      }
      picksRef.current.push(newPick);

      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.strokeStyle = "#494848";
      context.moveTo(width / 2, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      context.beginPath();
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "#FFFFFF";

      let x = width / 2 - picksLength;
      for (const pick of picksRef.current) {
        context.moveTo(x, pick.moveToY);
        context.lineTo(x, pick.lineToY);
        x += 1;
      }
      context.stroke();
      context.closePath();
    } else {
      context.clearRect(0, 0, width, height);
      picksRef.current = [];
      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "#494848";
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();
    }
  }

  draw();

  return <canvas height="300" width="1500" ref={canvasRef} />;
};

//Central Line

// context.strokeStyle = "#968383";
// context.beginPath();
// context.moveTo(width / 2, height - 70);
// context.lineTo(width / 2, 70);
// context.stroke();
// context.closePath();

// Draw line downwards
// context.moveTo(width / 2, height / 2);
// context.lineTo(width / 2, (maxPick / 255) * height);
//
// Draw line upwards
// context.moveTo(width / 2, height / 2);
// context.lineTo(width / 2, height - (maxPick / 255) * height);
