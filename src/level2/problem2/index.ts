export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  //combine logs from all sources into one list
  const intervals = args.flat();

  if (intervals.length === 0) {
    return [];
  }

  intervals.sort((a, b) => a[0].getTime() - b[0].getTime());

  const result: DowntimeLogs = [[intervals[0][0], intervals[0][1]]];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];

    if (start.getTime() <= last[1].getTime()) {
      //same window or overlap - keep the later end time
      if (end.getTime() > last[1].getTime()) {
        last[1] = end;
      }
    } else {
      //gap before this period - start a new entry
      result.push([start, end]);
    }
  }

  return result;
}