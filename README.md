# HotelGuest-Pro 🏨

**HotelGuest-Pro** is a full-stack hotel guest management system designed for hotel owners to manage guest data securely and efficiently. It supports Aadhaar image uploads to Cloudinary and allows exporting guest records into Excel sheets with embedded images.

---

## 🌐 Live URL

- **Frontend (Netlify)**: [https://hotelguest-pro.netlify.app](https://hotelguest-pro.netlify.app)

---

## ✨ Features

- 🔐 Secure login & registration (JWT)
- ➕ Add, edit & delete guest entries
- 🖼 Upload Aadhaar image (stored on Cloudinary)
- 📅 Filter guests by name, city, date, and month
- 📤 Export guest data with Aadhaar image in Excel format
- 📈 Dashboard with hotel-wise guest management

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React.js, Tailwind CSS              |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB Atlas                       |
| Authentication | JWT                               |
| File Storage | Cloudinary                          |
| Excel Export | ExcelJS                             |
| Hosting      | Netlify (frontend), Render (backend)|

---

## 🔗 Core API Endpoints

| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| POST   | `/api/auth/register`          | User registration          |
| POST   | `/api/auth/login`             | User login                 |
| GET    | `/api/guests/`                | Get all guests             |
| GET    | `/api/guests/filter`          | Filter guests              |
| POST   | `/api/guests/`                | Add a guest (with image)   |
| PUT    | `/api/guests/:id`             | Update guest               |
| DELETE | `/api/guests/:id`             | Delete guest               |
| GET    | `/api/excel/download-excel`   | Download Excel with images |



## 📺 Demo Video

[![Watch on YouTube](https://img.youtube.com/vi/acLHT6jByVE/0.jpg)](https://www.youtube.com/watch?v=acLHT6jByVE)

> Click the thumbnail above or [watch the full demo here](https://www.youtube.com/watch?v=acLHT6jByVE)

---

## 🧑‍💻 Author

**Ayush Sareen**  
GitHub: [@Ayush-Sareen](https://github.com/Ayush-Sareen)
