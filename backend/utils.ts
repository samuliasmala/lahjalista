import { compare as bcryptCompare, hash } from 'bcrypt';
import { lucia } from './auth';

export async function verifyPassword(
  givenPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcryptCompare(givenPassword, hashedPassword);
  return isMatch;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}

let loopInterval: NodeJS.Timeout | undefined = undefined;

// 24 hours
const timeoutTime = 24 * 60 * 60 * 1000;

export async function deleteExpiredSessionsLoop() {
  if (loopInterval === undefined) {
    // run delete function immediately, otherwise would need to wait 24 hours for the first run
    await lucia.deleteExpiredSessions();
    loopInterval = setInterval(async () => {
      await lucia.deleteExpiredSessions();
    }, timeoutTime);
  }
}
