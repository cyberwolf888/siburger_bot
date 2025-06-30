import { db } from "./firebase";
import { FieldValue } from "firebase-admin/firestore";

// Order interface
export interface Order {
  id?: string;
  userId: number;
  username?: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

// User interface
export interface User {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  lastActive: Date;
  orderCount: number;
}

// Orders collection operations
export class OrdersService {
  private static readonly COLLECTION = "orders";

  static async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const order: Omit<Order, "id"> = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(this.COLLECTION).add(order);
    return docRef.id;
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    const doc = await db.collection(this.COLLECTION).doc(orderId).get();
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Order;
  }

  static async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<void> {
    await db.collection(this.COLLECTION).doc(orderId).update({
      status,
      updatedAt: new Date(),
    });
  }

  static async getUserOrders(userId: number): Promise<Order[]> {
    const snapshot = await db
      .collection(this.COLLECTION)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  }

  static async getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
    const snapshot = await db
      .collection(this.COLLECTION)
      .where("status", "==", status)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  }
}

// Users collection operations
export class UsersService {
  private static readonly COLLECTION = "users";

  static async createOrUpdateUser(
    userData: Omit<User, "createdAt" | "lastActive" | "orderCount">
  ): Promise<void> {
    const userRef = db.collection(this.COLLECTION).doc(userData.id.toString());
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user
      await userRef.update({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        lastActive: new Date(),
      });
    } else {
      // Create new user
      const user: User = {
        ...userData,
        createdAt: new Date(),
        lastActive: new Date(),
        orderCount: 0,
      };
      await userRef.set(user);
    }
  }

  static async getUser(userId: number): Promise<User | null> {
    const doc = await db
      .collection(this.COLLECTION)
      .doc(userId.toString())
      .get();
    if (!doc.exists) {
      return null;
    }

    return doc.data() as User;
  }

  static async incrementOrderCount(userId: number): Promise<void> {
    const userRef = db.collection(this.COLLECTION).doc(userId.toString());
    await userRef.update({
      orderCount: FieldValue.increment(1),
      lastActive: new Date(),
    });
  }
}

// Menu items for easy reference
export const MENU_ITEMS = {
  burgers: [
    { name: "Classic Beef", price: 8.99 },
    { name: "Cheeseburger", price: 9.99 },
    { name: "Double Cheese", price: 12.99 },
    { name: "BBQ Bacon", price: 13.99 },
    { name: "Mushroom Swiss", price: 11.99 },
    { name: "Spicy Jalapeño", price: 10.99 },
  ],
  sides: [
    { name: "French Fries", price: 3.99 },
    { name: "Onion Rings", price: 4.99 },
    { name: "Side Salad", price: 5.99 },
  ],
  drinks: [
    { name: "Soft Drinks", price: 2.99 },
    { name: "Fresh Juice", price: 3.99 },
    { name: "Coffee", price: 2.49 },
  ],
};

export const getAllMenuItems = () => [
  ...MENU_ITEMS.burgers,
  ...MENU_ITEMS.sides,
  ...MENU_ITEMS.drinks,
];
