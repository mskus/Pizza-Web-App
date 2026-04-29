"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase/client";
import { useMenu, type MenuCategory, type MenuItem } from "@/hooks/useMenu";
import { useEffect } from "react";

type ProductFormState = {
  name: string;
  ingredients: string;
  price: string;
  category: MenuCategory;
};

const INITIAL_FORM: ProductFormState = {
  name: "",
  ingredients: "",
  price: "",
  category: "Pizza"
};

const ALLOWED_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminDashboard() {
  const { items, loading, error } = useMenu();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bootingAuth, setBootingAuth] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setBootingAuth(false);
        return;
      }

      if (ALLOWED_ADMIN_EMAIL && user.email !== ALLOWED_ADMIN_EMAIL) {
        signOut(auth);
        setLoginError("Bu hesap admin paneli icin yetkili degil.");
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }

      setBootingAuth(false);
    });

    return () => unsub();
  }, []);

  const isAuthorized = useMemo(() => {
    if (!currentUser) {
      return false;
    }
    if (!ALLOWED_ADMIN_EMAIL) {
      return true;
    }
    return currentUser.email === ALLOWED_ADMIN_EMAIL;
  }, [currentUser]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setLoginError(null);

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginPassword("");
    } catch {
      setLoginError("Giris basarisiz. E-posta veya sifreyi kontrol et.");
    } finally {
      setAuthLoading(false);
    }
  }

  function startEdit(item: MenuItem) {
    setEditingItem(item);
    setForm({
      name: item.name,
      ingredients: item.ingredients,
      price: String(item.price),
      category: item.category
    });
    setSelectedImage(null);
    setActionError(null);
  }

  function resetForm() {
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setSelectedImage(null);
    setActionError(null);
  }

  async function uploadImageIfExists(file: File | null) {
    if (!file) {
      return null;
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const imageRef = ref(storage, `menu/${fileName}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);

    return {
      imageUrl,
      imagePath: imageRef.fullPath
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setActionError(null);

    try {
      const price = Number(form.price);
      if (Number.isNaN(price) || price <= 0) {
        throw new Error("Fiyat sifirdan buyuk olmali.");
      }

      const uploaded = await uploadImageIfExists(selectedImage);

      if (editingItem) {
        const payload: Record<string, unknown> = {
          name: form.name.trim(),
          ingredients: form.ingredients.trim(),
          price,
          category: form.category,
          updatedAt: serverTimestamp()
        };

        if (uploaded) {
          payload.imageUrl = uploaded.imageUrl;
          payload.imagePath = uploaded.imagePath;

          if (editingItem.imagePath) {
            await deleteObject(ref(storage, editingItem.imagePath));
          }
        }

        await updateDoc(doc(db, "menuItems", editingItem.id), payload);
      } else {
        const newItem: Record<string, unknown> = {
          name: form.name.trim(),
          ingredients: form.ingredients.trim(),
          price,
          category: form.category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        if (uploaded) {
          newItem.imageUrl = uploaded.imageUrl;
          newItem.imagePath = uploaded.imagePath;
        }

        await addDoc(collection(db, "menuItems"), newItem);
      }

      resetForm();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Islem basarisiz.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    const confirmed = window.confirm(`${item.name} urununu silmek istiyor musun?`);
    if (!confirmed) {
      return;
    }

    try {
      if (item.imagePath) {
        await deleteObject(ref(storage, item.imagePath));
      }
      await deleteDoc(doc(db, "menuItems", item.id));
    } catch {
      setActionError("Urun silinirken bir hata olustu.");
    }
  }

  if (bootingAuth) {
    return <p className="p-6 text-sm text-coal/70">Yukleniyor...</p>;
  }

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 font-serif text-3xl text-coal">Admin Giris</h1>
        <form onSubmit={handleLogin} className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
          <input
            type="email"
            required
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.target.value)}
            placeholder="Admin e-posta"
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            placeholder="Sifre"
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          {loginError && <p className="text-sm text-tomato">{loginError}</p>}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-md bg-basil px-4 py-2 text-sm text-dough disabled:opacity-60"
          >
            {authLoading ? "Giris yapiliyor..." : "Giris yap"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-2">
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 font-serif text-2xl text-coal">
          {editingItem ? "Urunu Duzenle" : "Yeni Urun Ekle"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Urun adi"
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          <textarea
            required
            value={form.ingredients}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, ingredients: event.target.value }))
            }
            placeholder="Icindekiler"
            className="min-h-24 w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="Fiyat"
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value as MenuCategory }))
            }
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          >
            <option value="Pizza">Pizza</option>
            <option value="Baslangic">Baslangic</option>
            <option value="Icecek">Icecek</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
            className="w-full rounded-md border border-coal/20 px-3 py-2 text-sm"
          />
          {actionError && <p className="text-sm text-tomato">{actionError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-basil px-4 py-2 text-sm text-dough disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : editingItem ? "Guncelle" : "Ekle"}
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-coal/20 px-4 py-2 text-sm text-coal"
              >
                Iptal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 font-serif text-2xl text-coal">Menu Urunleri</h2>
        {loading && <p className="text-sm text-coal/70">Yukleniyor...</p>}
        {error && <p className="text-sm text-tomato">{error}</p>}
        {!loading && !items.length && (
          <p className="text-sm text-coal/70">Henuz urun eklenmedi.</p>
        )}
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-coal/10 bg-dough/30 p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-coal">{item.name}</h3>
                  <p className="text-coal/70">{item.ingredients}</p>
                  <p className="mt-1 text-basil">
                    {item.category} - {item.price.toFixed(2)} TL
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-md border border-coal/20 px-2 py-1"
                  >
                    Duzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-md border border-tomato/40 px-2 py-1 text-tomato"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
