# n8n Workflow to Web App Project

## Project Overview
This project converts an n8n workflow into a production web application using Next.js and React.

## Tools & MCPs Required
- **n8n MCP**: Access to view/modify workflows, nodes, and configurations
- **n8n Skill**: Workflow optimization and configuration
- **Front-end Designer Skill**: UI/UX development
- **GitHub MCP**: Repository management and version control

## Workflow Pipeline

### Phase 1: Workflow Optimization
- Review n8n workflow for proper data intake/output structure
- Ensure webhook endpoints are configured for web app integration
- Validate data formats match front-end requirements
- Test workflow responses

### Phase 2: Front-end Development
- Build Next.js/React application
- Implement API routes to communicate with n8n webhooks
- Develop UI components for workflow interaction
- Test locally before deployment

### Phase 3: Deployment
- Push to GitHub repository
- Deploy to Vercel with auto-sync enabled
- Configure environment variables
- Verify production deployment

## Project Structure
```
/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utilities and helpers
├── public/              # Static assets
├── .env.local          # Local environment variables
├── .env.production     # Production variables (git-ignored)
└── claude.md           # This file
```

## n8n Instance Configuration
- **Instance URL**: [TO BE CONFIGURED]
- **Webhook Pattern**: `/webhook/[workflow-name]`
- **Data Format**: JSON request/response

## Environment Variables
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=
N8N_API_KEY=
```

## Development Workflow
1. Optimize workflow in n8n
2. Build/modify front-end locally
3. Test integration with n8n webhooks
4. Commit changes to GitHub
5. Auto-deploy to Vercel
6. Verify production functionality

## Notes
- Keep code modular and reusable
- Document any workflow-specific requirements
- Maintain clean commit history
