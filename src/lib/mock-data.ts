import type { UserRole, Condition, InventoryItem } from "@/types";

export const ROLES: UserRole[] = ["Store Manager", "Finance Manager", "HR/Admin", "CEO", "Director", "IT"];

export const CONDITIONS: Condition[] = ["Good", "Damaged", "Lost"];

export const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Microphone",
    total: 50,
    available: 35,
    lastUpdated: "2023-10-26",
    transactions: [],
  },
  {
    id: 2,
    name: "Projector",
    total: 20,
    available: 18,
    lastUpdated: "2023-10-25",
    transactions: [],
  },
  {
    id: 3,
    name: "Laptop",
    total: 100,
    available: 80,
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 4,
    name: "Conference Speaker",
    total: 30,
    available: 30,
    lastUpdated: "2023-10-22",
    transactions: [],
  },
  {
    id: 5,
    name: "HDMI Cable (10ft)",
    total: 200,
    available: 150,
    lastUpdated: "2023-10-27",
    transactions: [],
  },
  {
    id: 6,
    name: "Whiteboard",
    total: 15,
    available: 12,
    lastUpdated: "2023-10-24",
    transactions: [],
  },
];
