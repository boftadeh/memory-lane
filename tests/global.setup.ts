import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function globalSetup() {
  try {
    await execAsync(`sqlite3 memories.db "
      DELETE FROM memory_tags;
      DELETE FROM memories;
      DELETE FROM sqlite_sequence WHERE name IN ('memories', 'memory_tags');
    "`);
  } catch (error) {
    throw error;
  }
}

export default globalSetup; 