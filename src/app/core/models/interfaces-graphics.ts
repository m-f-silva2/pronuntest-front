export interface OrganizedData {
    [key: string]: {
      phoneme: string[];
      users_name: string[];
      users_id: number[];
      best: number[];
      worst: number[];
      intents: number[];
      type_game: string[];
    };
  }
  
  export interface DataItem {
    phoneme: string;
    users_name: string;
    users_id: number;
    best: number;
    worst: number;
    intents: number;
    type_game: string;
  }
  
  export interface Table {
    users_name: string;
    users_other: string;
    users_image: string;
    users_avatar: string;
    users_id: number;
    users_identification: number;
    users_gender: string;
    users_age: number;
    users_condition: string;
    users_date_admission: string;
    users_progress_now: string;
  }