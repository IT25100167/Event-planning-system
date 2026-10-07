# EventFlow - React.js Event Management System

A modern event planning and management system built with React.js, TypeScript, and Tailwind CSS.

## Overview

EventFlow is a comprehensive event management platform with role-based dashboards for:
- **Operations Managers**: Full control over events, finance, vendors, and team management
- **Event Coordinators**: Task and event-specific coordination

## Features

### Core Features
✨ **Role-based Dashboards**
- Operations Manager view with global event oversight
- Event Coordinator view with assigned tasks
- Real-time statistics and KPIs

📅 **Event Management**
- Create and manage multiple events
- Track event progress with visual indicators
- Event status tracking (Planning, In progress, Completed)
- Venue and client information management

✅ **Task Management**
- Assign tasks to team members
- Set priorities and deadlines
- Track task completion status
- Filter and search tasks

👥 **Team Collaboration**
- Team workload monitoring
- User assignments and roles
- Profile management
- Communication features

📊 **Reports & Analytics**
- Event performance overview
- Completion rate charts
- Workload distribution
- Financial tracking (for Operations)

🎯 **Additional Features**
- Vendor management
- Booking packages and pricing
- Responsive mobile design
- Search and filtering
- Notification system
- Public landing page

## Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 4.3** - Styling
- **Lucide React** - Icons
- **CVA (Class Variance Authority)** - Component variants

### Build & Development
- **Create React App** - Build tooling
- **React Scripts 5.0** - Development server
- **PostCSS** - CSS processing

## Project Structure

```
frontend/
├── public/
│   ├── index.html           # HTML entry point
│   ├── icon.svg            # App icon
│   ├── apple-icon.png      # Apple touch icon
│   └── ...                 # Other static assets
├── src/
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # React DOM render
│   ├── index.css           # Global styles
│   ├── components/
│   │   ├── eventflow-app.tsx   # Main application
│   │   └── ui/
│   │       └── button.tsx      # Button component
│   └── lib/
│       └── utils.ts        # Utility functions
├── .env                    # Environment variables
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
└── package.json           # Dependencies & scripts
```

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Create environment file** (already included)
```bash
# .env file already configured
REACT_APP_API_URL=http://localhost:8080
```

4. **Start development server**
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject CRA configuration (not recommended)
npm run eject
```

## Usage

### Accessing the Application

1. **Landing Page**: Visit http://localhost:3000 to see the public landing page
2. **Login**: Click "Plan your event" or "Login" to access the dashboard
3. **Select Role**: Choose between Operations Manager or Event Coordinator

### Operations Manager Dashboard
- View all events and their progress
- Manage team assignments
- Monitor financial metrics
- Generate reports
- Manage vendors

### Event Coordinator Dashboard
- View assigned events
- Manage tasks for events
- Coordinate with team
- Track event timeline
- Update vendors

## Key Components

### EventFlowApp (Main Component)
- Manages application state
- Handles view switching (public/dashboard)
- Role-based rendering

### Landing Component
- Public-facing homepage
- Service showcase
- Package displays
- Call-to-action buttons

### RoleDashboard Component
- Role-specific interface
- Statistics and KPIs
- Event table and filters
- Task management
- Sidebar navigation

### UI Components
- **Button**: Reusable button with variants (default, outline, ghost, destructive, link)
- **Badge**: Status badges with tone variants
- **Logo**: Branded logo component

## Data Structure

### Events
```typescript
{
  id: string
  name: string
  client: string
  date: string
  venue: string
  progress: number (0-100)
  status: 'Planning' | 'In progress' | 'Completed'
  color: 'violet' | 'blue' | 'amber' | 'slate'
}
```

### Tasks
```typescript
[
  taskName: string,
  eventName: string,
  date: string,
  priority: 'High' | 'Medium' | 'Low',
  status: 'Pending' | 'In progress' | 'Completed'
]
```

## Configuration

### Environment Variables
Update `.env` to connect to your backend:

```env
REACT_APP_API_URL=http://localhost:8080
```

### Tailwind Customization
Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- Extensions

## Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **CVA** for component variant management
- **Responsive design** - Mobile, tablet, and desktop optimized
- **Dark mode ready** - Includes dark mode utilities

### Color Scheme
- Primary: Violet (#654ce6, #6d55ed)
- Secondary: Blue, Amber, Emerald
- Neutral: Slate
- Backgrounds: White, Light neutral grays

## Performance Optimizations

- Component memoization with React.memo
- Efficient state management with hooks
- Lazy computed values with useMemo
- Tailwind CSS purging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

### Adding New Features

1. Create component in `src/components/`
2. Use TypeScript for type safety
3. Follow existing code patterns
4. Add proper prop typing
5. Use Tailwind classes for styling

### API Integration

To integrate with the backend:

1. Create an API service in `src/services/api.ts`
2. Use environment variable `REACT_APP_API_URL`
3. Replace mock data with API calls
4. Update components to use fetched data

Example:
```typescript
// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/api/events`)
  return response.json()
}
```

## Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploy to Hosting
The `build/` folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Traditional web servers
- Docker containers

## Troubleshooting

### Port Already in Use
```bash
# Change default port
PORT=3001 npm start
```

### Clear npm Cache
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### Module Not Found Errors
```bash
# Remove node_modules and reinstall
rm -r node_modules
npm install --legacy-peer-deps
```

## Contributing

1. Create a new branch for features
2. Follow existing code style
3. Write clear commit messages
4. Test thoroughly
5. Submit pull request

## License

Proprietary - EventFlow

## Support

For issues or questions, please contact the development team.

## Changelog

### Version 0.1.0 (Current)
- Initial React.js conversion from Next.js
- Full feature parity maintained
- Improved build performance
- Better SEO support ready

---

**Last Updated**: September 2026
**Next.js to React.js Conversion**: Complete ✅
