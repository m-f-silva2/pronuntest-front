import { IslandLevel } from "./island_level"


export interface SumaryActivities extends IslandLevel {
  isl_lev_id?: number
  sum_act_best_accuracy_ia?: number
  sum_act_date_created?: string
  sum_act_id?: number
  sum_act_intents?: number
  sum_act_score_game?: number
  sum_act_worst_accuracy_ia?: number
  users_id?: number
}
