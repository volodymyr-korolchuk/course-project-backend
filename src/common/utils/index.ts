function calculateHoursDifference(date1: Date, date2: Date): number {
  const diffInMilliseconds: number = date2.getTime() - date1.getTime();
  const diffInHours: number = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}
