"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type MenuCategory = "Pizza" | "Baslangic" | "Icecek";

export type MenuItem = {
  id: string;
  name: string;
  ingredients: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  imagePath?: string;
};

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const menuQuery = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      menuQuery,
      (snapshot) => {
        const nextItems: MenuItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            ingredients: data.ingredients,
            price: Number(data.price ?? 0),
            category: data.category,
            imageUrl: data.imageUrl,
            imagePath: data.imagePath
          } satisfies MenuItem;
        });

        setItems(nextItems);
        setLoading(false);
      },
      () => {
        setError("Menu verisi alinirken bir hata olustu.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { items, loading, error };
}
