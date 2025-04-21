import client from "./client";
import { StatusCodes } from "http-status-codes";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addDays,
  isWithinInterval,
  isFuture,
  addMonths,
} from "date-fns";
import { TokenResponse } from "../types/AuthTypes";

class DbService {
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

  static async FetchVisits(userId: number): Promise<any> {
    try {
      const response = await client.get(`/users/${userId}/visits`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching visits for user ${userId}:`, error);
      const visits = [];
      const today = new Date();
      const randomDate = (start: Date, end: Date) => {
        const date = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        return date;
      };
      for (let i = 0; i < 10; i++) {
        const randomVisitDate = randomDate(
          startOfWeek(today),
          endOfWeek(today)
        );
        visits.push({
          id: i,
          date: format(randomVisitDate, "yyyy-MM-dd"),
          userId: userId,
        });
      }
      return visits;
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

  static async RemoveVisit(userId: number, date: Date): Promise<any> {
    try {
      const response = await client.delete(`/users/${userId}/visits`, {
        data: { date },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting visit:`, error);
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

  static async AddVisit(userId: number, date: Date): Promise<any> {
    try {
      const response = await client.post(`/users/${userId}/visits`, {
        date,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error adding visit:`, error);
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

  static async GetGroupMembers(groupId: number): Promise<any> {
    try {
      const response = await client.get(`/groups/${groupId}/members`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching group members:`, error);
      return [
        { id: 1, name: "Ryan" },
        { id: 2, name: "Jeff" },
      ];
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

  static async GetVisitsForGroupInWeek(groupName: string, start: Date, end: Date): Promise<any> {
    // Just fake Ryan has visited Mon/Wed/Fri
    const base = startOfWeek(new Date(), { weekStartsOn: 0 });
    return [
      {
        id: "v1",
        userId: "ryan",
        groupId: 1,
        timestamp: addDays(base, 1).toISOString(), // Monday
      },
      {
        id: "v2",
        userId: "ryan",
        groupId: 1,
        timestamp: addDays(base, 3).toISOString(), // Wednesday
      },
    ];
  }
}

export default DbService;
