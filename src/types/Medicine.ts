export interface Medicine {
    name: string,
    width: number,
    height: number,
    startDate: number,
    startingDose: number
    missed: number,
    dosages: number[]
}

// db.meds.insertOne({user: Nova, meds: [{name: 'fexo', dosages: [2, 3, 2]}]});

export interface UserHasMeds {
    username: string;
    medicines: Medicine[];
}