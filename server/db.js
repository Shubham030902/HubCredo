const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "data", "users.json");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
function read() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function write(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
module.exports = {
  findByEmail: (email) => {
    const d = read();
    return d.users.find(u => u.email === email);
  },
  addUser: (user) => {
    const d = read();
    d.users.push(user);
    write(d);
    return user;
  },
  findById: (id) => {
    const d = read();
    return d.users.find(u => u.id === id);
  }
};
