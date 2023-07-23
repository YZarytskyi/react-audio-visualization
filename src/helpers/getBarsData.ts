import { BarsData } from "../types/types.ts";

export const getBarsData = (
  buffer: AudioBuffer,
  height: number,
  width: number,
  barWidth: number,
  gap: number,
): BarsData[] => {
  const bufferData = buffer.getChannelData(0);
  const units = width / (barWidth + gap);
  const step = Math.floor(bufferData.length / units);
  const amp = height / 2;

  let data: BarsData[] = [];
  let maxDataPoint = 0;

  for (let i = 0; i < units; i++) {
    const mins: number[] = [];
    let minCount = 0;
    const maxs: number[] = [];
    let maxCount = 0;

    for (let j = 0; j < step && i * step + j < buffer.length; j++) {
      const datum = bufferData[i * step + j];
      if (datum <= 0) {
        mins.push(datum);
        minCount++;
      }
      if (datum > 0) {
        maxs.push(datum);
        maxCount++;
      }
    }
    const minAvg = mins.reduce((a, c) => a + c, 0) / minCount;
    const maxAvg = maxs.reduce((a, c) => a + c, 0) / maxCount;

    const dataPoint = { max: maxAvg, min: minAvg };

    if (dataPoint.max > maxDataPoint) maxDataPoint = dataPoint.max;
    if (Math.abs(dataPoint.min) > maxDataPoint)
      maxDataPoint = Math.abs(dataPoint.min);

    data.push(dataPoint);
  }

  if (amp * 0.8 > maxDataPoint * amp) {
    const adjustmentFactor = (amp * 0.8) / maxDataPoint;
    data = data.map((dp) => ({
      max: dp.max * adjustmentFactor,
      min: dp.min * adjustmentFactor,
    }));
  }

  return data;
};
