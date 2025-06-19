export interface MotorcycleType {
    make: string,
    models: ModelType[]
}

interface ModelType {
    name: string,
    years: number[]
}

export interface MotorcycleDetails {
  bore_stroke: string;
  clutch: string;
  compression: string;
  cooling: string;
  displacement: string;
  dry_weight: string;
  emission: string | null;
  engine: string;
  frame: string;
  front_brakes: string;
  front_suspension: string;
  front_tire: string;
  front_wheel_travel: string;
  fuel_capacity: string;
  fuel_consumption: string | null;
  fuel_control: string;
  fuel_system: string;
  gearbox: string;
  ground_clearance: string;
  ignition: string;
  lubrication: string | null;
  make: string;
  model: string;
  power: string | null;
  rear_brakes: string;
  rear_suspension: string;
  rear_tire: string;
  rear_wheel_travel: string;
  seat_height: string;
  starter: string;
  top_speed: string | null;
  torque: string | null;
  total_height: string;
  total_length: string;
  total_weight: string | null;
  total_width: string;
  transmission: string;
  type: string;
  valves_per_cylinder: number | null;
  wheelbase: string;
  year: string;
}