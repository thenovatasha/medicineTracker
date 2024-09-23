import {Request, Response} from "express";
import { createMedicine, updateMedicinesList } from "../../db/insert.js";
import { Medicine } from "../../types/Medicine.js";
import { getAllMeds } from "../../db/find.js";

/**
 * 
 * @param req 
 * @param res 
 */
export async function newMedHandler(req: Request, res: Response) {
    // @ts-ignore
    const username = req.username;
    if(!username) {
        return res.status(500).json({status: "username does not exist on req body"})
    }
    const medicine: Medicine = {
        name: "one-med",
        width: 15,
        height: 23,
        startDate: Date.now(),
        startingDose: 345,
        missed: 5,
        dosages: [1, 3, 5]
    }
    try {
        await createMedicine(username, medicine);
    } catch (e) {
        return res.status(200).json({status: "med existed"});
    }
    return res.status(200).json({status: "created med"});
}


export async function sendMedInfo(req: Request, res: Response) {
    console.log("HERE");
    //@ts-ignore
    const username = req.username;
    if(!username) {
        return res.status(500).json({status: "username does not exist on req body"})
    }
    const result = await getAllMeds(username);
    const final = await result.toArray();
    return res.status(203).json({finally: final[0].medicines});
}


export async function deleteMedHandler(req: Request, res: Response) {
    //@ts-ignore
    const username = req.username;
    if(!username) {
        return res.status(500).json({status: "username does not exist on req body"})
    }
    const result = await getAllMeds(username);
    const allOfUserMeds = await result.toArray();
    const newMeds = allOfUserMeds[0].medicines.filter((medicineObject) => medicineObject.name !== req.query.name);

    await updateMedicinesList(username, newMeds);
    return res.status(200).json({status: "med deleted"});
}

/**
    Add a dose, remove a dose, or rename the med
*/
export async function updateMedHandler(req: Request, res: Response) {


}