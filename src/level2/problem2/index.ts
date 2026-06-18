export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  const intervals = args.flat();

  if (intervals.length === 0) {
    return [];
  }

  // sort by start time so we can walk left to right
  intervals.sort((a, b) => a[0].getTime() - b[0].getTime());

  const result: DowntimeLogs = [[intervals[0][0], intervals[0][1]]];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];

    if (start.getTime() <= last[1].getTime()) {
      // overlaps or touches — extend end if needed
      if (end.getTime() > last[1].getTime()) {
        last[1] = end;
      }
    } else {
      result.push([start, end]);
    }
  }

  return result;
}
