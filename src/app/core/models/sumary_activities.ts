import { IslandLevel } from "./island_level"


export interface SumaryActivities extends IslandLevel {
  sum_act_id?: number
  isl_lev_id?: number
  user_id?: number
  score_game?: number
  date_created?: string
}
