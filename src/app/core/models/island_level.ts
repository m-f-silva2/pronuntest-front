export interface IslandLevel {
  isl_lev_id?: number
  isl_lev_str_id?: number
  intents?: number
  status?: string
  score?: number
  best_accuracy_ia?: number
  worst_accuracy_ia?: number
  date_created?: string
  sum_act_id?: number
}

export interface IslandLevelFull {
    isl_lev_id?: number
    isl_lev_str_id?: number
    intents?: number
    status?: string
    score?: number
    best_accuracy_ia?: number
    worst_accuracy_ia?: number
    date_created?: string
    sum_act_id?: number
    user_id?: number
    score_game?: number
    difficulty?: number
    phoneme?: string
    island_goal_score?: number
    level_goal_score?: number
    phoneme_type?: string
    code_island?: number
    code_pos_level?: number
    max_intents?: number
    description?: string
    manual_status?:  'inactive'|'active'
    therapy_status?: 'inactive'|'active'

}