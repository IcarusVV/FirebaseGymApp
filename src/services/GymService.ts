import client from "./client";
import { StatusCodes } from "http-status-codes";
import { TokenResponse } from "../types/AuthTypes";
import { Squad } from "../types/DbTypes";

class GymService {
  static async SignUp(
    username: string,
    password: string
  ): Promise<TokenResponse | string> {
    try {
      const response = await client.post("/users/create", {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error creating user ${username}:`, error);
      switch (error.response.status) {
        case StatusCodes.BAD_REQUEST:
          throw new Error("Invalid rating.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to submit rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }

  static async SignIn(
    username: string,
    password: string
  ): Promise<TokenResponse | string> {
    try {
      const response = await client.post("/users/signIn", {
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error logging in user ${username}:`, error);
      switch (error.response.status) {
        case StatusCodes.BAD_REQUEST:
          throw new Error("Invalid rating.");
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw new Error("Failed to submit rating.");
        default:
          throw new Error("An unexpected error occurred.");
      }
    }
  }

  static async getUserSquads(userId: number): Promise<Squad[]> {
    try {
      const response = await client.get(`/users/${userId}/squads`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching squads for user ${userId}:`, error);
      throw new Error("Failed to fetch squads.");
    }
  }
}

export default GymService;
