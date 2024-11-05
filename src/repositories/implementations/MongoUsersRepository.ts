import { IUsersRepository } from "../IUsersRepository";
import { User } from "../../entities/User";
import { UserMongoose } from "../../infra/database/schemas/userSchema";
import { convertToUser } from "../../utils/userUtils";

export class MongoUsersRepository implements IUsersRepository {
  async findById(id: string): Promise<User | null> {
    const userDoc = await UserMongoose.findById(id).lean().exec();
    return userDoc ? convertToUser(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserMongoose.findOne({ email }).lean().exec();
    return userDoc ? convertToUser(userDoc) : null;
  }

  async save(user: User): Promise<void> {
    const userDoc = new UserMongoose(user);
    await userDoc.save();
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUserDoc = await UserMongoose.findByIdAndUpdate(id, user, {
      new: true,
    })
      .lean()
      .exec();
    return updatedUserDoc ? convertToUser(updatedUserDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserMongoose.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}