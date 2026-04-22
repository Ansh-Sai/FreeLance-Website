# FREESURF — Freelance Reimagined 🏄

A modern, full-stack freelance platform connecting ambitious companies with world-class freelancers. Post projects, place bids, and close deals — all in one clean platform.

## Features

### For Freelancers 👨‍💻
- **Browse Projects** - Discover live projects from verified companies
- **Submit Bids** - Submit proposals with custom pricing and timeline
- **Track Bids** - See all your submitted bids in one place
- **Get Notified** - Instant notification when a company accepts your bid (🎉 "You've been selected!")
- **Build Profile** - Showcase skills, experience, GitHub, LinkedIn, hourly rates
- **Manage Proposals** - Track bid status and company feedback

### For Companies 🏢
- **Post Projects** - Create and publish projects in minutes
- **Review Bids** - See competitive proposals from freelancers
- **Accept Bids** - One-click bid acceptance with auto-rejection of other bids
- **Track Progress** - Monitor project status from open → in-progress → closed
- **Build Profile** - Company info, location, mission statement

### Platform Features 🎯
- **Email Verification** - OTP-based authentication for security
- **Secure Auth** - Password hashing with bcryptjs
- **Real-time Updates** - Bids and project status update instantly
- **Profile Persistence** - All profile data saved to MongoDB
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Modern UI** - Glassmorphism design with smooth animations

---

## Tech Stack

### Frontend
- **HTML5 / CSS3 / JavaScript** - Pure vanilla JS (no framework dependencies)
- **Tailwind CSS** - Utility-first styling
- **EmailJS** - Email delivery for OTP
- **localStorage** - Client-side session management

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - NoSQL database
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

### Deployment Ready
- MongoDB Atlas for cloud database
- Can be deployed to Heroku, AWS, Vercel, or any Node.js host

---

## Project Structure

```
freelance-platform/
├── models/
│   ├── User.js          # User schema (freelancers & companies)
│   ├── Project.js       # Project schema
│   └── Bid.js           # Bid schema
├── routes/
│   ├── auth.js          # Authentication & profile endpoints
│   ├── projects.js      # Project CRUD operations
│   └── bids.js          # Bid submission & acceptance
├── server.js            # Express server setup
├── freelance.html       # Single-page application
├── package.json         # Dependencies
├── .env                 # Environment variables (not in repo)
└── README.md            # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier available)
- npm or yarn

### 1. Clone & Install Dependencies

```bash
git clone <your-repo>
cd freelance-platform
npm install
```

### 2. Create `.env` File

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/freesurf?retryWrites=true&w=majority
PORT=5000
```

Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials.

### 3. Create Models Directory

```bash
mkdir -p models routes
```

Then place these files in their respective directories:
- `models/User.js`
- `models/Project.js`
- `models/Bid.js`
- `routes/auth.js`
- `routes/projects.js`
- `routes/bids.js`

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm install -D nodemon
npx nodemon server.js
```

The server will start on `http://localhost:5000`

### 5. Open in Browser

Open `freelance.html` in your browser or serve it via a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npm install -g http-server
http-server
```

Then navigate to `http://localhost:8000/freelance.html`

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create new user account (freelancer or company) |
| POST | `/login` | Authenticate and return user profile |
| PATCH | `/profile` | Update user profile (all fields) |

**POST /signup**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "freelancer" // or "company"
}
```

**POST /login**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**PATCH /profile** (authenticated user)
```json
{
  "userId": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "location": "Bangalore, India",
  "bio": "Full-stack developer",
  "skills": ["React", "Node.js", "MongoDB"],
  "hourlyRate": 50,
  "experience": "expert",
  "availability": "freelance",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

### Project Routes (`/api/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Fetch all projects |
| GET | `/:projectId` | Fetch specific project |
| POST | `/` | Create new project (company only) |

**POST /projects** (company account)
```json
{
  "title": "Build React E-commerce App",
  "description": "Full-featured e-commerce platform with admin dashboard",
  "budget": 2500
}
```

### Bid Routes (`/api/bids`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/project/:projectId` | Get all bids for a project |
| GET | `/freelancer/:freelancerId` | Get all bids by a freelancer |
| POST | `/` | Submit a new bid |
| PATCH | `/:bidId/accept` | Accept a bid (company only) |

**POST /bids** (freelancer account)
```json
{
  "projectId": "project_id",
  "freelancerId": "freelancer_id",
  "amount": 2000,
  "proposal": "I have 5+ years experience. Can deliver in 2 weeks."
}
```

**PATCH /bids/:bidId/accept** (company account)
- Marks bid as `accepted`
- Auto-rejects all other bids on the same project
- Changes project status to `in-progress`

---

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'freelancer', 'company'),
  phone: String,
  location: String,
  bio: String,
  dob: String,
  github: String,
  linkedin: String,
  
  // Freelancer-specific
  skills: [String],
  hourlyRate: Number,
  experience: String (enum: 'beginner', 'intermediate', 'expert'),
  availability: String (enum: 'fulltime', 'parttime', 'freelance'),
  
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  budget: Number,
  companyId: ObjectId (ref: User),
  status: String (enum: 'open', 'in-progress', 'closed'),
  requiredSkills: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Bid Model
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  freelancerId: ObjectId (ref: User),
  amount: Number,
  proposal: String,
  status: String (enum: 'pending', 'accepted', 'rejected'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Key Features Explained

### Profile Management
- Users can save comprehensive profiles including skills, experience, links
- Data persists in MongoDB across sessions
- Freelancers get profile completion percentage tracker
- Companies can set location and company mission

### Bidding System
- Freelancers browse projects and submit proposals
- Companies see all incoming bids with proposal preview
- One-click bid acceptance with auto-rejection of competing bids
- Real-time status updates without page refresh

### Authentication & Security
- Email-based sign-up with OTP verification
- Passwords hashed with bcryptjs (10 rounds)
- Session management via localStorage
- CORS enabled for cross-origin requests

### Responsive UI
- Mobile-first design approach
- Glassmorphic UI with backdrop blur effects
- Smooth animations and transitions
- Touch-friendly buttons and inputs
- Works on all modern browsers

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/freesurf?retryWrites=true&w=majority

# Server Port
PORT=5000

# Optional: EmailJS Configuration
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_OTP_TEMPLATE=your_emailjs_template_id
```

### EmailJS Setup (Optional)

To enable automated OTP emails:
1. Create account at [emailjs.com](https://www.emailjs.com/)
2. Create email service and template
3. Add keys to `.env`
4. Update keys in `freelance.html` (lines 718-721)

Without EmailJS, the OTP will display in a toast notification instead.

---

## Usage Flow

### For Freelancers

1. **Sign Up** → Choose "Freelancer" role
2. **Verify Email** → Enter OTP sent to email
3. **Build Profile** → Add skills, experience, links, rate
4. **Browse Projects** → View all available projects
5. **Place Bid** → Submit proposal with amount
6. **Track Bids** → See bid status in "My Bids" tab
7. **Get Selected** → See 🎉 notification when company accepts

### For Companies

1. **Sign Up** → Choose "Company" role
2. **Verify Email** → Enter OTP sent to email
3. **Post Project** → Fill title, description, budget
4. **Review Bids** → Click "View Bids" on any project
5. **Accept Best Bid** → One click to accept, auto-rejects others
6. **Track Progress** → Monitor project status

---

## Common Tasks

### Reset a User's Password
```javascript
// In routes/auth.js, add a forgot-password endpoint
// or manually update via MongoDB compass
```

### Change Project Status
```javascript
// Update via Company dashboard or directly in MongoDB
Project.findByIdAndUpdate(projectId, { status: 'closed' })
```

### View All Bids for a Project
```
GET /api/bids/project/:projectId
```

### Get User's Profile
```
GET /api/auth/profile/:userId
```

---

## Customization

### Change Colors
Edit CSS variables in `freelance.html` (lines 11-22):
```css
:root {
  --bg: #080b14;        /* Dark background */
  --accent: #38bdf8;    /* Cyan accent */
  --accent2: #818cf8;   /* Purple accent */
  --accent3: #34d399;   /* Green accent */
  /* ... etc */
}
```

### Modify UI Text
Search for hardcoded strings in `freelance.html` and update

### Add New Profile Fields
1. Add field to User schema in `models/User.js`
2. Add input in profile page HTML
3. Update `saveProfile()` in `freelance.html`
4. Update `showProfile()` to populate the field

### Change API Endpoints
Update all fetch URLs in `freelance.html` (currently `http://localhost:5000`)

---

## Troubleshooting

### "Cannot connect to server"
- Verify server is running: `node server.js`
- Check `.env` MONGO_URI is correct
- Verify port 5000 is not in use
- Check browser console for detailed errors (F12)

### Bids not showing
- Verify projectId is passed correctly
- Check server logs for database errors
- Ensure bids exist in MongoDB for that project

### Profile not saving
- Check userId is in currentUser
- Verify PATCH request to `/api/auth/profile`
- Check MongoDB connection
- Look for validation errors in server console

### OTP not sending
- EmailJS requires proper configuration
- Check EMAILJS credentials in .env
- OTP will still display as toast if EmailJS fails
- Check browser console for EmailJS errors

### CORS errors
- Verify CORS is enabled in `server.js`
- Check frontend URL matches allowed origin
- For development, `localhost:*` should be allowed

---



### Deploy to Vercel
1. Frontend: Deploy `freelance.html` as static site
2. Backend: Deploy Node.js to Vercel serverless functions

---

## Performance Optimization

### Frontend
- Lazy-load project images
- Minify JavaScript and CSS
- Cache frequently accessed data
- Implement infinite scroll for projects

### Backend
- Add database indexing on frequently queried fields
- Implement pagination for large result sets
- Add caching layer (Redis)
- Monitor API response times

### Database
```javascript
// Add indexes to User collection
db.users.createIndex({ email: 1 });

// Add indexes to Project collection
db.projects.createIndex({ companyId: 1 });
db.projects.createIndex({ status: 1 });

// Add indexes to Bid collection
db.bids.createIndex({ projectId: 1 });
db.bids.createIndex({ freelancerId: 1 });
```

---

## Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Reviews and ratings system
- [ ] Messaging between users
- [ ] Contract templates
- [ ] Time tracking & invoicing
- [ ] Portfolio showcase for freelancers
- [ ] Admin dashboard
- [ ] Email notifications for all events
- [ ] Escrow payment system
- [ ] Dispute resolution system
- [ ] Two-factor authentication
- [ ] Dark/light theme toggle
- [ ] Notifications bell with history
- [ ] Advanced project filtering/search
- [ ] Freelancer recommendation engine

---

## Security Considerations

### Implemented
- ✅ Password hashing with bcryptjs
- ✅ Email verification via OTP
- ✅ CORS protection
- ✅ Input validation on backend
- ✅ User ID verification in API calls

### Recommended
- 🔲 Add JWT tokens for session management
- 🔲 Implement rate limiting on auth endpoints
- 🔲 Add HTTPS/SSL in production
- 🔲 Validate email domain during signup
- 🔲 Implement refresh tokens
- 🔲 Add request logging and monitoring
- 🔲 Use environment variables for all secrets
- 🔲 Implement API versioning

---


## License

This project is licensed under the ISC License - see `package.json` for details.

---

## Support

For issues, questions, or feature requests:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce
4. Describe your environment (Node version, MongoDB version, etc.)

---

## Roadmap

**Phase 1** (Current)
- ✅ Core bidding system
- ✅ Project management
- ✅ Profile management
- ✅ Bid acceptance workflow

**Phase 2** (Next)
- 🚀 Payment integration
- 🚀 Messaging system
- 🚀 Reviews & ratings
- 🚀 Notifications

**Phase 3** (Future)
- 🔮 Advanced search
- 🔮 Recommendations
- 🔮 Analytics dashboard
- 🔮 API for third-party integration

---

## Team

Built with ❤️ for the freelance community.

---

## Changelog

### v1.0.0 (Current)
- Initial release with core features
- Freelancer and company roles
- Project posting and bidding
- Bid acceptance workflow
- Profile management with persistence
- OTP-based authentication

---

## FAQ

**Q: Is this free to use?**
A: Yes, FREESURF is open-source and free. Host it yourself.

**Q: Can I white-label this?**
A: Yes, you can customize branding, colors, and domain.

**Q: How do I enable payments?**
A: Integrate Stripe or PayPal in the checkout flow.

**Q: What's the maximum file upload size?**
A: Currently not implemented. Can be added via multer.

**Q: Can freelancers work part-time?**
A: Yes, availability is set during profile setup.

