# Coy — Discover

Coy is a swipe-based profile discovery application inspired by platforms like Tinder and Bumble. It allows users to discover profiles, express interest by liking or passing, and connect with others when a mutual match occurs.

The project focuses on a simple, interactive, and mobile-friendly discovery experience with a matching system that ensures a connection is created only when both users like each other.

## Features

- **Profile Discovery:** Browse user profiles with details such as name, age, bio, interests, and location.
- **Swipe Interaction:** Like or pass on profiles using swipe gestures on mobile devices.
- **Desktop Interaction:** Use Like and Pass buttons to interact with profiles.
- **No Repeated Profiles:** Previously swiped profiles do not appear again in the discovery feed.
- **Mutual Matching:** A match is created only when both users have liked each other.
- **Matches Section:** View profiles with whom a mutual match has occurred.
- **Privacy-Focused Matching:** Other users' likes are not exposed through the discovery feed. Only mutual matches are displayed.
- **Persistent Data:** Swipe actions and matching information are stored.
- **Empty State:** Displays an appropriate message when no more profiles are available.

## How Matching Works

1. Users browse profiles in the Discover section.
2. A user can Like or Pass on a profile.
3. The application records the swipe action.
4. If the other profile has already liked the current user, a mutual match is created.
5. The matched profile becomes available in the Matches section.
6. If there is no mutual like, no match is created.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Application framework |
| React | User interface |
| JavaScript | Application logic |
| CSS | Styling and responsive design |
| Next.js API Routes | Backend functionality |
| JSON | File-based data persistence |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed` | Returns profiles that have not been swiped on |
| POST | `/api/swipe` | Records Like or Pass actions and checks for mutual matching |
| GET | `/api/matches` | Returns mutual matches only |
| POST | `/api/reset` | Restores initial seed data for demonstration |

### Swipe Request Example

\`\`\`json
{
  "profileId": "profile-id",
  "direction": "like"
}
\`\`\`

The direction can be either `like` or `pass`.

## Data Persistence

The application uses JSON-file-based persistence.

- Application data is stored in `data/db.json`.
- The database file is automatically created on the first API request.
- Profile information, swipe actions, and matching information are maintained in the data file.
- The reset endpoint restores the initial seed data for testing and demonstration.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

\`\`\`bash
git clone https://github.com/Prachi-2507/Coy-Discover.git
\`\`\`

Navigate to the project directory:

\`\`\`bash
cd Coy-Discover
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open your browser:

\`\`\`
http://localhost:3000
\`\`\`

For mobile interaction testing, enable mobile device emulation in browser developer tools.

## Project Objective

The objective of Coy is to demonstrate a simple profile discovery and matching experience with emphasis on user interaction, backend API functionality, mutual matching logic, privacy, and data persistence.

The application combines frontend interactions with backend API routes to provide a functional and responsive discovery experience.

---

**GitHub Repository:** [Coy — Discover](https://github.com/Prachi-2507/Coy-Discover)
