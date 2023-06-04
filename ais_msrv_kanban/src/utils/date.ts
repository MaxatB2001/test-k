export const getDifferenceInDays = (date1: Date, date2: Date): number => {
    const differenceInTime = date2.getTime() - date1.getTime()
    return Math.abs(Math.ceil(differenceInTime / (1000 * 3600 * 24)))
}