import {Request, Response} from "express";
import { createMedicine, extraDose, forgotDose, updateMedicinesList } from "../../db/update.js";
import { Medicine } from "../../types/Medicine.js";
import { getAllMeds } from "../../db/find.js";
import { MedicineInfo, StatusResponse } from "../../types/ResponseStatus.js";

/**
 * 
 * @param req 
 * @param res 
 */
export async function newMedHandler(req: Request, res: Response<StatusResponse>) {
    // @ts-ignore
    const {username} = req.body;

    const {name, width, height, startDate, startingDose, missed, dosages} = req.body;
    
    const medicine: Medicine = {
        name: name,
        width: width,
        height: height,
        startDate: startDate,
        startingDose: startingDose,
        missed: missed,
        dosages: dosages
    }
    try {
        await createMedicine(username, medicine);
    } catch (e) {
        return res.status(400).json({status: "failure"});
    }
    return res.status(201).json({status: "success"});
}


export async function sendMedInfo(req: Request, res: Response<MedicineInfo>) {
    //@ts-ignore
    const {username} = req.body;
    const result = await getAllMeds(username);
    const medicineInfo = await result.toArray();
    return res.status(203).json({medicine: medicineInfo[0].medicines});
}

/**
 * Delete a medicine for the user
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteMedHandler(req: Request, res: Response<StatusResponse>) {
    //@ts-ignore
    const {username} = req.body;
    const result = await getAllMeds(username);
    const allOfUserMeds = await result.toArray();
    const newMeds = 
        allOfUserMeds[0].medicines
        .filter((medicineObject) => medicineObject.name !== req.query.name);
    
    await updateMedicinesList(username, newMeds);
    return res.status(200).json({status: "success"});
}

/**
    Add a dose, remove a dose, or rename the med (extended functionality)
*/
export async function updateMedHandler(req: Request, res: Response<StatusResponse>) {

    const {username, medicine, amount, type} = req.body;
    console.log(typeof amount);
    if(type === "forgot") {
        // removes a dose to a med
        await forgotDose(username, medicine, amount);
    
    } else if (type === "extra") {
        // adds a dose to a med
        await extraDose(username, medicine, amount);
    }
    // TODO: Later implementation
    // rename medicine

    return res.status(200).json({status: "success"});
}