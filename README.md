IntelliSearch: Web Scraper Application
Project Overview

IntelliSearch is a web application that allows users to:
Search for individuals by ID (Cédula) using a web-scraping backend.
View search results with pagination.
Access detailed information for each individual (profile info, phone numbers, image, and general details).
Authenticate users securely via Firebase Authentication.

Stack:
Frontend: Angular 17 (Standalone Components + Tailwind CSS)
Backend: Python Flask with Selenium
Authentication: Firebase Auth
Deployment: Railway (Full-stack app on single URL)

Project Structure:
IntelliSearch/
├─ frontend/                 # Angular frontend
│  ├─ src/
│  ├─ angular.json
│  └─ package.json
├─ backend/                  # Flask backend
│  ├─ app/
│  │  ├─ scraper/            # Selenium scraping logic
│  │  ├─ __init__.py
│  │  └─ ...
│  ├─ scrape_details.py
│  ├─ run.py
│  └─ requirements.txt
├─ README.md
└─ ...

Features:
Login / Logout
Firebase authentication
Standalone Angular login page
AuthGuard ensures only logged-in users access search/results pages
Search Functionality
Search by Cédula
Displays a paginated list of results (10 per page)
“Next” / “Previous” buttons fetch new results while keeping previously fetched results
Details Page
Shows personal info (name, cédula, image)

General information table:
Phone numbers accordion
Handles empty/missing data gracefully
Deployment Ready
Angular frontend served directly from Flask backend
One URL deployment
Fully portable project

Local Setup (For Client or Developer):
1. Clone the repository
git clone <your-repo-url>
cd IntelliSearch

2. Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt

3. Setup Frontend
cd ../frontend
npm install

Update Firebase Config

Edit frontend/src/environments/firebase.config.ts:

export const firebaseConfig = {
  apiKey: "<YOUR_FIREBASE_API_KEY>",
  authDomain: "<YOUR_PROJECT>.firebaseapp.com",
  projectId: "<YOUR_PROJECT>",
  storageBucket: "<YOUR_PROJECT>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>"
};

4. Build Angular
ng build --prod


Output folder: frontend/dist/frontend/

5. Run Flask Backend
cd ../backend
python run.py


Visit: http://127.0.0.1:5000

Login with your Firebase user

Test search, pagination, and details

Deployment Instructions

Railway Deployment

Create a new Railway project.

Connect GitHub repo or upload project files.

Set environment variables if needed (e.g., Firebase keys).

Railway will detect Flask app and deploy.

Client can access app at the provided Railway URL.

Production Notes

Angular is pre-built and served via Flask.

Firebase Authentication requires valid API keys.

Ensure Selenium has access to ChromeDriver or headless browser in production.

Usage

Navigate to the login page.

Enter valid email/password (Firebase user).

Search for a person using Cédula.

Navigate through results using Next/Previous buttons.

Click on a result to view details (image, generales, phone numbers).

Logout when finished.

Technologies Used

Angular 17: Standalone components, reactive forms, Tailwind CSS

Flask: Python backend with API endpoints /scrape and /details

Selenium: Automates browser for scraping dynamic pages

Firebase Auth: Email/password authentication

Railway: Hosting and deployment

Notes for Client

All scraping logic uses Selenium; ChromeDriver must be available if running locally.

Firebase credentials are required for login.

Pagination stores previously fetched results for better performance.

Details page handles dynamic elements like accordions.

Single URL deployment ensures smooth client experience.

Support

Frontend Issues: Check browser console for Angular errors.

Backend Issues: Check terminal logs for Flask/Selenium errors.

Firebase Issues: Verify API keys and authentication configuration.