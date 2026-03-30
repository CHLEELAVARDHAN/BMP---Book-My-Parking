import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("parking.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    pincode TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone TEXT, 
    category TEXT, 
    slot_number TEXT,
    floor TEXT,
    section TEXT,
    status TEXT DEFAULT 'Available'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    slot_id INTEGER,
    vehicle_number TEXT,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    exit_time DATETIME,
    duration_minutes INTEGER,
    total_fee REAL,
    payment_status TEXT DEFAULT 'Pending',
    payment_method TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(slot_id) REFERENCES slots(id)
  );
`);

// Seed Slots if empty
const slotCount = db.prepare("SELECT COUNT(*) as count FROM slots").get() as { count: number };
if (slotCount.count === 0) {
  const zones = ["Mall", "Airport", "Railway"];
  const categories = ["Car", "Bike", "EV"];
  for (const zone of zones) {
    for (const category of categories) {
      for (let i = 1; i <= 15; i++) {
        const floor = i <= 5 ? "G" : (i <= 10 ? "1" : "2");
        const section = i % 2 === 0 ? "A" : "B";
        db.prepare("INSERT INTO slots (zone, category, slot_number, floor, section) VALUES (?, ?, ?, ?, ?)")
          .run(zone, category, `${category[0]}${i}`, floor, section);
      }
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Auth
  app.post("/api/signup", (req, res) => {
    const { username, password, name, phone, address, city, pincode } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (username, password, name, phone, address, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)").run(username, password, name, phone, address, city, pincode);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json({ success: true, user: { ...user, isNew: true } });
    } catch (e) { res.status(400).json({ error: "Username already exists" }); }
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) res.json({ success: true, user: { ...user, isNew: false } });
    else res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/user/update", (req, res) => {
    const { id, name, phone, address, city, pincode } = req.body;
    db.prepare("UPDATE users SET name = ?, phone = ?, address = ?, city = ?, pincode = ? WHERE id = ?").run(name, phone, address, city, pincode, id);
    res.json({ success: true, user: db.prepare("SELECT * FROM users WHERE id = ?").get(id) });
  });

  // Slots & Bookings
  app.get("/api/slots", (req, res) => {
    res.json(db.prepare("SELECT * FROM slots WHERE zone = ? AND category = ?").all(req.query.zone, req.query.category));
  });

  app.post("/api/bookings", (req, res) => {
    const { userId, slotId, vehicleNumber } = req.body;
    const slot = db.prepare("SELECT status FROM slots WHERE id = ?").get(slotId) as any;
    if (slot.status !== 'Available') return res.status(400).json({ error: "Occupied" });
    const bookingId = db.transaction(() => {
      db.prepare("UPDATE slots SET status = 'Occupied' WHERE id = ?").run(slotId);
      return db.prepare("INSERT INTO bookings (user_id, slot_id, vehicle_number) VALUES (?, ?, ?)").run(userId, slotId, vehicleNumber).lastInsertRowid;
    })();
    res.json({ success: true, bookingId });
  });

  app.get("/api/bookings/active/:userId", (req, res) => {
    res.json(db.prepare("SELECT b.*, s.slot_number, s.zone, s.category, s.floor, s.section FROM bookings b JOIN slots s ON b.slot_id = s.id WHERE b.user_id = ? AND b.exit_time IS NULL").get(req.params.userId) || null);
  });

  app.post("/api/bookings/exit", (req, res) => {
    const { bookingId, paymentMethod } = req.body;
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as any;
    const duration = Math.ceil((Date.now() - new Date(booking.entry_time).getTime()) / 60000);
    const fee = Math.max(10, duration * 2);
    db.transaction(() => {
      db.prepare("UPDATE bookings SET exit_time = CURRENT_TIMESTAMP, duration_minutes = ?, total_fee = ?, payment_status = 'Paid', payment_method = ? WHERE id = ?").run(duration, fee, paymentMethod, bookingId);
      db.prepare("UPDATE slots SET status = 'Available' WHERE id = ?").run(booking.slot_id);
    })();
    res.json({ success: true, fee, duration });
  });

  app.get("/api/bookings/history/:userId", (req, res) => {
    res.json(db.prepare("SELECT b.*, s.slot_number, s.zone, s.category, s.floor, s.section FROM bookings b JOIN slots s ON b.slot_id = s.id WHERE b.user_id = ? AND b.exit_time IS NOT NULL ORDER BY b.exit_time DESC").all(req.params.userId));
  });

  app.get("/api/user/stats/:userId", (req, res) => {
    res.json(db.prepare("SELECT COUNT(*) as total_bookings, SUM(total_fee) as total_spent, SUM(duration_minutes) as total_duration FROM bookings WHERE user_id = ? AND exit_time IS NOT NULL").get(req.params.userId));
  });

  // Admin
  app.get("/api/admin/stats", (req, res) => {
    res.json({
      revenue: db.prepare("SELECT SUM(total_fee) as total FROM bookings WHERE payment_status = 'Paid'").get().total || 0,
      bookings: db.prepare("SELECT COUNT(*) as count FROM bookings").get().count,
      active: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE exit_time IS NULL").get().count,
      users: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count
    });
  });

  app.get("/api/admin/users", (req, res) => res.json(db.prepare("SELECT * FROM users ORDER BY created_at DESC").all()));
  app.get("/api/admin/recent-bookings", (req, res) => res.json(db.prepare("SELECT b.*, u.name as user_name, s.slot_number, s.zone FROM bookings b JOIN users u ON b.user_id = u.id JOIN slots s ON b.slot_id = s.id ORDER BY b.entry_time DESC LIMIT 10").all()));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}
startServer();
