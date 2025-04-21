import client from "./client";
import { StatusCodes } from "http-status-codes";
import { TokenResponse } from "../types/AuthTypes";
import { Squad, User } from "../types/DbTypes";

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

  static async getSquadUsers(squadId: number): Promise<User[]> {
    try {
      const response = await client.get(`/squads/${squadId}/members`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching users for squad ${squadId}:`, error);
      throw new Error("Failed to fetch users.");
    }
  }

  static async getSquadVisits(
    squadId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{ user_id: number; username: string; visit_date: string }[]> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
  
      const response = await client.get(`/squads/${squadId}/visits`, { params });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching visits for squad ${squadId}:`, error);
      throw new Error("Failed to fetch squad visits.");
    }
  }
}

export default GymService;
