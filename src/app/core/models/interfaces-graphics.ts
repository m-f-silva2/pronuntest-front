export interface OrganizedData {
    [key: string]: {
      phoneme: string[];
      user_name: string[];
      users_id: number[];
      best: number[];
      worst: number[];
      intents: number[];
    };
  }
  
  export interface DataItem {
    phoneme: string;
    user_name: string;
    users_id: number;
    best: number;
    worst: number;
    intents: number;
  }
  
  export interface Table {
    user_name: string;
    role_name: string;
    other: string;
    image: string;
    avatar: string;
    users_id: number;
    identification: number;
    gender: string;
    age: number;
    condition: string;
    date_admission: string;
    progress_now: string;
  }