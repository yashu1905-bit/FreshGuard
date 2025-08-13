// import React, { useState } from "react";
// import "./App.css";

// export default function App() {
//   const [items, setItems] = useState([]);
//   const [name, setName] = useState("");
//   const [expiry, setExpiry] = useState("");

//   const addItem = () => {
//     if (!name || !expiry) return;
//     setItems([...items, { name, expiry }]);
//     setName("");
//     setExpiry("");
//   };

//   const deleteItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const today = new Date();
//   const expired = items.filter(
//     (item) => new Date(item.expiry) < today
//   ).length;
//   const nearExpiry = items.filter((item) => {
//     const diff =
//       (new Date(item.expiry) - today) / (1000 * 60 * 60 * 24);
//     return diff >= 0 && diff <= 3;
//   }).length;

//   return (
//     <div className="container">
//       <h1>Grocery Expiry Tracker</h1>

//       {/* Stats */}
//       <div className="stats-container">
//         <div className="stat-card stat-total">
//           <div className="stat-title">Total Items</div>
//           <div className="stat-value">{items.length}</div>
//         </div>
//         <div className="stat-card stat-expired">
//           <div className="stat-title">Expired</div>
//           <div className="stat-value">{expired}</div>
//         </div>
//         <div className="stat-card stat-near-expiry">
//           <div className="stat-title">Near Expiry</div>
//           <div className="stat-value">{nearExpiry}</div>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="form">
//         <input
//           type="text"
//           placeholder="Item name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="date"
//           value={expiry}
//           onChange={(e) => setExpiry(e.target.value)}
//         />
//         <button onClick={addItem}>Add</button>
//       </div>

//       {/* Items List */}
//       <div className="item-list">
//         {items.map((item, index) => (
//           <div className="item-card" key={index}>
//             <div className="item-info">
//               <div className="item-name">{item.name}</div>
//               <div className="item-date">
//                 Expiry: {item.expiry}
//               </div>
//             </div>
//             <button
//               className="delete-btn"
//               onClick={() => deleteItem(index)}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [user, setUser] = useState(null);

  // Track user login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Load items from Firestore (per user)
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    const itemsRef = collection(db, "users", user.uid, "groceryItems");
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    });
    return () => unsubscribe();
  }, [user]);

  // Add item
  const addItem = async () => {
    if (!name || !expiry || !user) return;
    const itemsRef = collection(db, "users", user.uid, "groceryItems");
    await addDoc(itemsRef, { name, expiry });
    setName("");
    setExpiry("");
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "groceryItems", id));
  };

  const today = new Date();
  const expired = items.filter(
    (item) => new Date(item.expiry) < today
  ).length;
  const nearExpiry = items.filter((item) => {
    const diff =
      (new Date(item.expiry) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  return (
    <div className="container">
      <h1>Grocery Expiry Tracker</h1>

      {/* Login */}
      <Login user={user} setUser={setUser} />

      {/* Stats */}
      {user && (
        <>
          <div className="stats-container">
            <div className="stat-card stat-total">
              <div className="stat-title">Total Items</div>
              <div className="stat-value">{items.length}</div>
            </div>
            <div className="stat-card stat-expired">
              <div className="stat-title">Expired</div>
              <div className="stat-value">{expired}</div>
            </div>
            <div className="stat-card stat-near-expiry">
              <div className="stat-title">Near Expiry</div>
              <div className="stat-value">{nearExpiry}</div>
            </div>
          </div>

          {/* Form */}
          <div className="form">
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <button onClick={addItem}>Add</button>
          </div>

          {/* Items List */}
          <div className="item-list">
            {items.map((item) => (
              <div className="item-card" key={item.id}>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-date">
                    Expiry: {item.expiry}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


