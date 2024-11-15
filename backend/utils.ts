import { compare as bcryptCompare, hash } from 'bcrypt';

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
