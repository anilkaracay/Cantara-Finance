import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HISTORY_FILE = path.join(__dirname, '../../data/history.json');

export interface HistoryEntry {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'BORROW' | 'REPAY';
    asset: string;
    amount: string;
    timestamp: string;
    txId?: string;
}

export class HistoryService {
    private static async ensureFile() {
        try {
            await fs.access(HISTORY_FILE);
        } catch {
            await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
            await fs.writeFile(HISTORY_FILE, '[]');
        }
    }

    static async addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
        await this.ensureFile();
        const data = await fs.readFile(HISTORY_FILE, 'utf-8');
        const history: HistoryEntry[] = JSON.parse(data);

        const newEntry: HistoryEntry = {
            ...entry,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
        };

        history.unshift(newEntry); // Add to beginning
        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
        return newEntry;
    }

    static async getHistory(): Promise<HistoryEntry[]> {
        await this.ensureFile();
        const data = await fs.readFile(HISTORY_FILE, 'utf-8');
        return JSON.parse(data);
    }
}
