# Skill-Bridge: AI-Powered Career Navigator

**Candidate Name:** Aditya  
**Scenario Chosen:** Scenario 2 - AI-Powered Skill Gap Analysis & Learning Roadmap  
**Estimated Time Spent:** ~5 Hours  

🎥 **Demo Video:** [Watch on YouTube](https://youtu.be/EbCrhJ9xyAY)
---

## 🚀 Quick Start

### Prerequisites
* **Python 3.9+** (For the FastAPI Backend and Langchain)
* **Node.js v18+ & npm** (For the React/Vite Frontend)
* **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))

### Run Commands

**1. Start the Backend (Terminal 1)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
*Create a `.env` file in the `backend` directory and add your key:*
```text
GOOGLE_API_KEY=your_api_key_here
```
```bash
uvicorn main:app --reload
# Server runs on [http://127.0.0.1:8000](http://127.0.0.1:8000)
```

**2. Start the Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Test Commands
The frontend utilizes **Vitest** for isolated component and validation testing.
```bash
cd frontend
npm run test
```

---

## 🤖 AI Disclosure

**Did you use an AI assistant (Copilot, ChatGPT, etc.)?** Yes. I used an LLM as a conversational pair-programmer to bounce architectural ideas off of, generate synthetic JSON dummy data, and accelerate boilerplate setup.

**How did you verify the suggestions?**
I verified all AI-generated code by actively testing the API endpoints via Swagger UI (`/docs`), strictly typing the data pipelines with Pydantic (Backend) and Zod (Frontend), and writing custom Vitest unit tests to ensure edge cases (like empty form submissions) were caught correctly.

**Examples of suggestions I rejected or changed:**
I actively overruled several architectural suggestions to better fit a production-grade environment:
1. **LLM & Tooling Choice:** I opted to use Google's Gemini 1.5 Flash via LangChain instead of a basic OpenAI SDK implementation to leverage faster structured JSON outputs and robust fallback mechanisms.
2. **Modularization (`main.py` and `App.jsx`):** The AI initially suggested monolithic files. I manually refactored `App.jsx` to act strictly as a state router, pushing local state, API calls, and Zod validation down to individual, highly modular View components.
3. **Error & Loading States:** I rejected the suggestion to use generic global error banners. Instead, I implemented *local* error handling (for precise form validation feedback) paired with a *global* full-screen loading overlay. This protects the state machine and prevents user interaction during high-latency LLM network requests.

---

## ⚖️ Tradeoffs & Prioritization

**What did you cut to stay within the 4–6 hour limit?**
* **PDF Resume Parsing:** To stay strictly within the timebox and focus on the core LLM gap-analysis logic, I cut the OCR/PDF extraction pipeline. Instead, I simulated file parsing by instantly loading synthetic user data via a JSON fixture ("Upload Resume" button). Building a robust PDF pipeline (e.g., AWS Textract or PyPDF) would have consumed too much time.
* **Database Persistence:** Instead of setting up a PostgreSQL instance and Prisma ORM, I opted for stateless API endpoints and JSON file fixtures to demonstrate the fallback functionality seamlessly.

**What would you build next if you had more time?**
1. **Live Job Description (JD) Parsing:** Allow users to paste a LinkedIn or direct job board URL, utilizing a web scraper (like BeautifulSoup) to dynamically extract the required tech stack rather than relying on a dropdown selection.
2. **Authentication & Dynamic Progress:** Implement OAuth and a database to save user roadmaps, allowing them to dynamically check off completed phases and track their learning progress over time.
3. **Interactive Voice AI Mock Interviews:** Upgrade the static mock interview flashcards into a real-time, WebRTC-based voice application where the user can actually speak their answers to the AI, and the AI evaluates their technical accuracy.
4. **Resume-Based Vector Search:** Implement a vector database (like Pinecone or ChromaDB) to allow users to semantically search for roles that uniquely fit their parsed skills.

**Known Limitations:**
* **LLM Hallucinations:** While heavily mitigated by strict Pydantic Output Parsers in LangChain, the Gemini API could theoretically still hallucinate non-existent learning resources or invalid URLs.
* **API Rate Limiting:** The application relies on the free tier of the Gemini API. Rapid, successive gap-analysis requests may trigger a `429 Too Many Requests` error (though the application will elegantly catch this and render the offline/fallback curriculum data).
* **Ephemeral State:** Because there is no database, refreshing the browser page clears the entire React state, forcing the user to restart from Step 1.
```

