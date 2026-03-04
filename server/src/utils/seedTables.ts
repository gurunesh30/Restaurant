import dotenv from "dotenv";
import Table from "../models/Table.js";
import connectDB from "../config/db.js";

dotenv.config();

type TableShape = "circle" | "square" | "rectangle";
type TableSection = "Ground" | "Lounge" | "patio";

interface TableSeed {
    tableNumber: number;
    label: string;
    capacity: number;
    shape: TableShape;
    section: TableSection;
    floor: number;
}

const tableSeedData: TableSeed[] = [
    // ── FLOOR 1 (Ground Floor) ───────────────────────
    { tableNumber: 1, label: 'G-01', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 2, label: 'G-02', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 3, label: 'G-03', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 4, label: 'G-04', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 5, label: 'G-05', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 6, label: 'G-06', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 7, label: 'G-07', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 8, label: 'G-08', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 9, label: 'G-09', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 10, label: 'G-10', capacity: 6, shape: 'rectangle', section: 'Ground', floor: 1 },
    { tableNumber: 11, label: 'G-11', capacity: 6, shape: 'rectangle', section: 'Ground', floor: 1 },
    { tableNumber: 12, label: 'G-12', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 13, label: 'G-13', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 14, label: 'G-14', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 15, label: 'G-15', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 16, label: 'G-16', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },
    { tableNumber: 17, label: 'G-17', capacity: 4, shape: 'circle', section: 'Ground', floor: 1 },
    { tableNumber: 18, label: 'G-18', capacity: 2, shape: 'square', section: 'Ground', floor: 1 },

    // ── FLOOR 2 (Lounge Floor) ───────────────────────
    { tableNumber: 19, label: 'L-01', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 20, label: 'L-02', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 21, label: 'L-03', capacity: 4, shape: 'square', section: 'Lounge', floor: 2 },
    { tableNumber: 22, label: 'L-04', capacity: 4, shape: 'square', section: 'Lounge', floor: 2 },
    { tableNumber: 23, label: 'L-05', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 24, label: 'L-06', capacity: 6, shape: 'rectangle', section: 'Lounge', floor: 2 },
    { tableNumber: 25, label: 'L-07', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 26, label: 'L-08', capacity: 4, shape: 'square', section: 'Lounge', floor: 2 },
    { tableNumber: 27, label: 'L-09', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 28, label: 'L-10', capacity: 8, shape: 'rectangle', section: 'Lounge', floor: 2 },
    { tableNumber: 29, label: 'L-11', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 30, label: 'L-12', capacity: 4, shape: 'square', section: 'Lounge', floor: 2 },
    { tableNumber: 31, label: 'L-13', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 32, label: 'L-14', capacity: 2, shape: 'circle', section: 'Lounge', floor: 2 },
    { tableNumber: 33, label: 'L-15', capacity: 4, shape: 'square', section: 'Lounge', floor: 2 },

    // ── FLOOR 3 (Patio / Sky Terrace) ───────────────────────
    { tableNumber: 34, label: 'R-01', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 35, label: 'R-02', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 36, label: 'R-03', capacity: 4, shape: 'square', section: 'patio', floor: 3 },
    { tableNumber: 37, label: 'R-04', capacity: 4, shape: 'square', section: 'patio', floor: 3 },
    { tableNumber: 38, label: 'R-05', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 39, label: 'R-06', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 40, label: 'R-07', capacity: 8, shape: 'rectangle', section: 'patio', floor: 3 },
    { tableNumber: 41, label: 'R-08', capacity: 6, shape: 'rectangle', section: 'patio', floor: 3 },
    { tableNumber: 42, label: 'R-09', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 43, label: 'R-10', capacity: 4, shape: 'square', section: 'patio', floor: 3 },
    { tableNumber: 44, label: 'R-11', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
    { tableNumber: 45, label: 'R-12', capacity: 2, shape: 'circle', section: 'patio', floor: 3 },
];

const seedTables = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Production guard
        if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
            throw new Error("Refusing destructive seed in production without ALLOW_PROD_SEED=true");
        }

        const existing = await Table.countDocuments();
        if (existing > 0) {
            console.log(`⚠️  ${existing} tables already exist. Dropping and re-seeding...`);
            await Table.deleteMany({});
        }

        const created = await Table.insertMany(tableSeedData);
        console.log(`✅  Inserted ${created.length} tables successfully.`);
        console.log("Floors breakdown:");
        console.log(`  Floor 1 (Ground):  ${tableSeedData.filter(t => t.floor === 1).length} tables`);
        console.log(`  Floor 2 (Lounge):  ${tableSeedData.filter(t => t.floor === 2).length} tables`);
        console.log(`  Floor 3 (Patio):   ${tableSeedData.filter(t => t.floor === 3).length} tables`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding tables:", error);
        process.exit(1);
    }
};

seedTables();
