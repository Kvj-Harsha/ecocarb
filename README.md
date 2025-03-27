# 🌱 EcoCarb: AI-Powered Carbon Emission Prediction 🚗💨

## 📌 Overview
EcoCarb is an AI-driven platform designed to predict carbon emissions from vehicles using machine learning. It leverages **Next.js** for the frontend and **Flask** for the backend, integrating **ML models** for emission prediction and driving behavior analysis. Additionally, it utilizes an open-source **LLM (Gemini Flash 1.5)** to generate AI-driven insights based on real-time vehicle parameters.

## ✨ Features
✅ **Carbon Emission Prediction** using **XGBoost** model 📊  
✅ **Harsh Driving Detection** with a **Random Forest Classifier** 🚗⚠️  
✅ **AI Insights** from **Gemini Flash 1.5** based on vehicle hardware parameters 🧠  
✅ **User-Friendly Web Interface** built with **Next.js** and **Aceternity UI** 🎨  
✅ **Real-Time Predictions** via **Flask API** ⚡  
✅ **Secure Authentication & Database** powered by **Firebase** 🔐  

---

## 🛠 Tech Stack
### 🖥️ Frontend:
- 🚀 **Next.js** (React-based framework)
- 🎨 **Tailwind CSS** (for styling)
- 🏗 **Aceternity UI** (component library)
- 🛑 **React Bits** (prebuilt UI components)
- 🔥 **Firebase** (authentication & database)

### 🔧 Backend:
- 🐍 **Flask** (Python-based micro-framework)
- 🤖 **Machine Learning Models:**
  - 📈 **XGBoost** (for carbon emission prediction)
  - 🏎 **Random Forest** (for harsh driving detection)
- 🧠 **Open-source LLM** (Gemini Flash 1.5 for AI insights)

---

## 🚀 Installation & Setup
### Prerequisites 📋
🔹 **Node.js & npm** (for frontend development) 🖥️  
🔹 **Python & pip** (for backend development) 🐍  
🔹 **Firebase account** (for authentication & database) 🔥  

### 🔥 Backend Setup (Flask API):
1️⃣ **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/EcoCarb.git
   cd EcoCarb/backend
   ```
2️⃣ **Create and activate a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3️⃣ **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4️⃣ **Run the Flask server:**
   ```sh
   python app.py
   ```

### 🎨 Frontend Setup (Next.js):
1️⃣ **Navigate to the frontend directory:**
   ```sh
   cd ../frontend
   ```
2️⃣ **Install dependencies:**
   ```sh
   npm install
   ```
3️⃣ **Start the development server:**
   ```sh
   npm run dev
   ```

---

## 📡 API Endpoints
### **🚀 POST /predict**
📌 **Description:** Predicts carbon emissions based on vehicle attributes.

🔹 **Request Body (JSON):**
```json
{
  "fuel_type": "Petrol",
  "vehicle_type": "Sedan",
  "car_age": 5,
  "road_gradient": 2,
  "cylinders": 4,
  "engine_size": 1.8,
  "traffic_condition": 1,
  "make": "Toyota",
  "model": "Corolla",
  "transmission": "Automatic"
}
```

🔹 **Response (JSON):**
```json
{
  "predicted_emission": 120.5
}
```

---

## 🤝 Contributing
We welcome contributions! If you'd like to contribute, follow these steps:
1. **Fork the repository** 🍴  
2. **Create a new branch** for your feature 🛠  
3. **Commit your changes** with meaningful messages 📝  
4. **Push to your branch** 🚀  
5. **Open a pull request** for review 🔍  

---

## 📝 License
This project is licensed under the **MIT License** 📜  

---

## 📬 Contact
For any inquiries or support, feel free to reach out at 📧 [cs23b1034@iiitr.ac.in](mailto:cs23b1034@iiitr.ac.in)
