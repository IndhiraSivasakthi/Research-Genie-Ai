# 🧠 ResearchGenie AI – Chrome Extension + Web App

ResearchGenie AI is a full-stack AI-powered system that helps users quickly analyze and understand text from any webpage or manual input using advanced AI processing.

It consists of:

* A **Chrome Extension** for real-time text analysis
* A **Web Application** for manual input and demo usage
* A **Spring Boot Backend API** deployed live using Docker

---

# 🚀 Live Demo

🌐 **Web App:**
https://research-genie-ai.onrender.com/

🔗 **Backend API:**
http://localhost:8080/index.html

---

# 🧩 Project Architecture

```
Chrome Extension  →  Spring Boot API  →  Gemini AI
Web App (Static)  →  Spring Boot API  →  Gemini AI
```

---

# ⚙️ Features

## 1️⃣ Text Selection Detection

* Detects selected text from any webpage
* Automatically captures content for processing

## 2️⃣ AI Summarization

* Converts long text into short summaries

## 3️⃣ Bullet Point Generation

* Transforms paragraphs into key points

## 4️⃣ Smart Suggestions

* Provides:

  * Related topics
  * Deeper research ideas
  * Learning paths

## 5️⃣ Copy Results

* Copy output instantly to clipboard

## 6️⃣ Download Results

* Download AI output as `.txt` file

## 7️⃣ Clean UI Formatting

* Bold headings
* Bullet points
* Scrollable output

---

# 🖥️ Two Ways to Use the Project

## 🔹 1. Chrome Extension Mode

```
Select text → Sidebar → AI Processing → Result
```

✔ Works on any website
✔ Real-time research assistant

---

## 🔹 2. Web App Mode

```
Enter text → Submit → AI Processing → Result
```

✔ No extension required
✔ Easy demo & sharing

---

# 🛠️ Tech Stack

## Frontend

* HTML
* CSS
* JavaScript

## Extension

* Chrome Extension API

## Backend

* Spring Boot
* REST API
* WebClient

## AI Integration

* Gemini API

## Deployment

* Docker
* Render (Cloud Hosting)

## Tools

* IntelliJ
* VS Code
* Chrome Browser
* Postman
* Github
* Github Desktop
  
---

# 📁 Project Structure

```
researchgenie-ai/

├── ai-research-extension/
│   ├── content.js
│   ├── styles.css
│   ├── sidebar.html
│   ├── manifest.json
│
├── src/main/java/com/researchgenie/ai/
|       |       ├── config/
│       │       │   ├── CorsConfig.java
│       │       │   └── WebClientConfig.java
│       │       │
│       │       ├── controller/
│       │       │   └── ResearchController.java
│       │       │
│       │       ├── dto/
│       │       │   ├── GeminiResponse.java
│       │       │   └── ResearchRequest.java
│       │       │
│       │       └── service/
│       │           └── ResearchService.java
│       │
├── src/main/resources/
│   ├── static/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── styles.css
│   └── application.properties
│
├── Dockerfile
├── pom.xml
```

---

# 🐳 Docker Deployment

## Dockerfile

```
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["sh","-c","java -jar target/*.jar"]
```

---

## Build Docker Image

```
docker build -t researchgenie-ai .
```

## Run Container

```
docker run -p 8080:8080 researchgenie-ai
```

---

# 🔑 Gemini API Key Setup

* To use AI features in ResearchGenie AI, you need a Gemini API key.

# 📌 Steps to Get API Key

```
1. Go to 👉 https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
```
# ⚙️ Add API Key to Project

🔹 Option 1: Environment Variable (Recommended)
```
GEMINI_API_KEY=your_api_key_here
```
🔹 Option 2: application.properties
```
gemini.api.key=your_api_key_here
```
---

# ☁️ Deployment (Render)

1. Push code to GitHub
2. Create Web Service on Render
3. Connect repository
4. Use Docker deployment
5. Add environment variables

---

# 🔄 API Workflow

```
1. User selects or enters text
2. Request sent to backend
3. Backend calls AI API
4. Response processed
5. Result displayed in UI
```

---

# 🧠 Purpose

* Simplify research
* Save time reading long content
* Improve productivity
* Extract meaningful insights quickly


---

# 🚀 Future Enhancements

* 🔹 AI Chat (ChatGPT-like sidebar)
* 🔹 User login & history
* 🔹 Voice input support
* 🔹 Multi-language processing
* 🔹 Export to PDF
* 🔹 Analytics dashboard

---

# 🏆 Highlights

✔ Full-stack project
✔ Chrome Extension + Web App
✔ AI Integration
✔ Docker Deployment
✔ Live Hosted API

---

# 📌 Author

**INDHIRA SIVASAKTHI J**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
