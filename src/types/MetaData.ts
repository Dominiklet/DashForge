export interface Meta {
  id: string,
  name: string,
  unit: string,
  startDate: string,
  endDate: string,
  timeZone: string,
}
export interface MetaData {
  [id:string]: Meta
}