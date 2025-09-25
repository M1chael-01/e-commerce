<img width="1902" height="886" alt="Snímek obrazovky 2025-07-14 223514" src="https://github.com/user-attachments/assets/461bb5f9-c6b4-4028-896d-6bbc057a0147" />

Video: https://www.youtube.com/watch?v=uTkPwmhwV44

📁 Project Structure
This project was bootstrapped with React and is split into two main parts:

🔙 Backend (/server)
Built with Node.js and Express

Handles API routes, Stripe payments, and PostgreSQL database

Location: server/

🔜 Frontend (/client)
Built with React.js

Manages UI, product pages, cart, and Stripe checkout

Location: server/client/

⚠️ Important Notes
Frontend and backend are separate — run both servers for full functionality.

Errors like loading issues or failed API calls may occur if the backend isn’t running.

The frontend is currently located inside the server/ folder — so make sure to double-check your file paths.

You will likely encounter problems when rendering the frontend.
To avoid these issues, I recommend creating a separate client folder using the following command: npx create-react-app client

Then, move the contents of server/src and server/public into the new client/ folder.
Your updated project structure should look like this: 
/client         ← React frontend
/server         ← Node.js + Express backend
.env

