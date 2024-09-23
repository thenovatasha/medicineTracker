import { Medicine } from "./Medicine";
export type StatusResponse = {
	status: "success" | "failure";
}

export type MedicineInfo = {
	medicine: Medicine[];
}

export type Unauthorized = {
	err: string;
}