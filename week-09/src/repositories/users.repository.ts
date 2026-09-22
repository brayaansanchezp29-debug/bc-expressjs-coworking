import { UserModel, type IUser } from '../models/user.model.js';

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email }).lean<IUser>().exec();
}

export async function createUser(
  data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>
): Promise<IUser> {
  const user = new UserModel(data);
  return user.save() as unknown as IUser;
}

export async function findUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec();
}
