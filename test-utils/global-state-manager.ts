import fs from "fs";
import path from "path";

import { Subscription } from "src/types/subscription";
import { ServiceOffering } from "src/types/serviceOffering";

export type GlobalState = {
  // Provider Data
  providerToken: string;
  date: string;

  // User Data
  userToken: string;
  serviceOfferings: ServiceOffering[];
  subscriptions: Subscription[];
};

const initialState: GlobalState = {
  providerToken: "",
  date: "",
  userToken: "",
  serviceOfferings: [],
  subscriptions: [],
};

const stateFilePath = path.join(process.cwd(), "test-results", "global-state.json");

export class GlobalStateManager {
  // Save State to File
  static saveState(state: GlobalState) {
    // Create Directory If Not Exists
    const dir = path.dirname(stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));
  }

  // Load State from File
  static loadState(): GlobalState {
    if (!fs.existsSync(stateFilePath)) {
      return { ...initialState };
    }

    try {
      const data = fs.readFileSync(stateFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading global state:", error);
      return { ...initialState };
    }
  }

  static setState(state: Partial<GlobalState>) {
    const currentState = this.loadState();
    this.saveState({ ...currentState, ...state });
  }

  static getToken(type: "provider" | "user") {
    const state = this.loadState();
    return state[type + "Token"];
  }

  static getDate() {
    const state = this.loadState();
    return state.date;
  }

  static getServiceOfferings() {
    const state = this.loadState();
    return state.serviceOfferings;
  }

  static getSubscriptions() {
    const state = this.loadState();
    return state.subscriptions;
  }
}
