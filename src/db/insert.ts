// insert a new user
// insert a new med for a user

import { IntegerType } from "mongodb";
import internal from "stream";

//  { name: Panadol,
//    size: [width, height],
//    startTime: Monday 12 pm,
//    missed: 0,
//    dosagesOfDay:     [
//                          {12pm: 2 },
// 				            {6 pm: 1},
// 			            ]
// }
//

type SinlgeDosage = {
  time: Number;
  qty: Number;
};

interface Dosage {
  dosages: Array<SinlgeDosage>;
}
createMedicine("nova", new Date(), 2, { dosages: [{ time: 12, qty: 2 }] });

export function createMedicine(
  name: string,
  startTime: Date,
  missed: Number,
  doseage: Dosage
) {}
