const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function ordinalSuffix(d: number): string {
  const mod100 = d % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function formatDeliveryDate(date: Date): string {
  const d = date.getDate();
  return `${DAYS[date.getDay()]}, ${d}${ordinalSuffix(d)} ${MONTHS[date.getMonth()]}`;
}

export interface DeliveryTimeline {
  hoursLeft: number | null;
  minsLeft: number | null;
  earliest: Date;
  latest: Date;
}

export function computeDeliveryTimeline(): DeliveryTimeline {
  const now = new Date();
  // WAT = UTC+1
  const lagosNow = new Date(now.getTime() + 60 * 60 * 1000);
  const lagosHour = lagosNow.getUTCHours();
  const lagosMin = lagosNow.getUTCMinutes();
  const CUTOFF = 17; // 5 PM Lagos time

  let hoursLeft: number | null = null;
  let minsLeft: number | null = null;
  if (lagosHour < CUTOFF) {
    const totalMins = (CUTOFF - lagosHour) * 60 - lagosMin;
    hoursLeft = Math.floor(totalMins / 60);
    minsLeft = totalMins % 60;
  }

  // Delivery window base: if order placed before cutoff, ships today; else tomorrow
  const base = new Date();
  if (lagosHour >= CUTOFF) base.setDate(base.getDate() + 1);

  const earliest = new Date(base);
  earliest.setDate(earliest.getDate() + 5);
  const latest = new Date(base);
  latest.setDate(latest.getDate() + 10);

  return { hoursLeft, minsLeft, earliest, latest };
}
