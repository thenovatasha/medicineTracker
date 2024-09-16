export interface Medicine {
    name: string,
    width: Number,
    height: Number,
    startDate: Date,
    startingDose: number
    missed: Number,
    dosages: Number[]
}

// db.meds.insertOne({user: Nova, meds: [{name: 'fexo', dosages: [2, 3, 2]}]});

export interface UserHasMeds {
    username: string;
    medicines: Medicine[];
}