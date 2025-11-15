# ViewProject Component

A comprehensive project detail page component built with Next.js, React, and Tailwind CSS, based on the Figma design specifications.

## Features

- **Responsive Layout**: Clean, centered layout with max-width constraints
- **Header Section**: Includes service branding and user avatar
- **Project Information Display**:
  - Project title with status badge (모집 중)
  - Author information with avatar
  - Creation date
  - Project timeline (start date, deadline)
  - Team positions and recruitment status (Frontend, Backend, AI, Mobile)
  - Project duration and difficulty level
- **Action Button**: "지원하기" (Apply) button for user interaction
- **Project Description**: Expandable card for detailed project information

## File Structure

```
viewProject/
├── page.tsx          # Next.js page wrapper
├── viewProject.tsx   # Main component implementation
└── README.md         # Documentation
```

## Usage

The component can be accessed at the route `/viewProject`. It uses mock data by default, which should be replaced with actual data from your API or props.

### Example Integration

```tsx
import { ViewProject } from "./viewProject";

// In your page or parent component
<ViewProject />;
```

## Data Structure

The component expects project data in the following format:

```typescript
{
  title: string; // Project title
  status: string; // Status (e.g., "모집 중")
  author: {
    name: string; // Author name
    avatar: string | null; // Avatar URL (optional)
    initials: string; // Initials for avatar fallback
  }
  createdAt: string; // Creation date
  startDate: string; // Project start date
  deadline: string; // Recruitment deadline
  positions: {
    frontend: string; // Frontend positions status
    backend: string; // Backend positions status
    ai: string; // AI positions status
    mobile: string; // Mobile positions status
  }
  duration: string; // Expected project duration
  difficulty: string; // Difficulty level
  description: string; // Project description
}
```

## Styling

The component uses:

- **Tailwind CSS** for styling
- **shadcn/ui** components (Badge, Button, Card)
- Custom color values matching the Figma design:
  - Primary Blue: `#488FE1`
  - Destructive Red: `#DC2626`, `#771F21`
  - Gray shades: `#0A0A0A`, `#505050`, `#E5E5E5`, `#F5F5F5`

## Components Used

- `Badge` - For status indicators (recruitment status, difficulty)
- `Button` - For the apply action
- `Card` - For the project description container

## Customization

To customize the component:

1. **Colors**: Update the hex color values in the className strings
2. **Layout**: Modify the width, padding, and gap values
3. **Typography**: Adjust text sizes and font weights
4. **Data**: Replace mock data with real data from your backend

## Future Enhancements

Potential improvements:

- Add dynamic data fetching from API
- Implement apply button functionality
- Add loading states
- Add error handling
- Implement rich text editor for project description
- Add image gallery for project screenshots
- Add team member profiles
- Implement real-time updates for recruitment status
