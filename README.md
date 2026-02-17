# waifulabs Landing Page

Landing page for waifulabs home infrastructure built with Nuxt v4 and Nuxt UI.

## Features

- 🏠 Landing page with links to documentation and blog
- 📝 Blog section (coming soon)
- 📋 Changelog displaying releases from [waifulabs/infrastructure](https://github.com/waifulabs/infrastructure)
- 🎨 Built with Nuxt UI and Tailwind CSS
- 🔤 Uses Inter font
- 🐳 Containerized with Docker
- 🚀 Automated deployment to GitHub Container Registry

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Docker

Build the container:

```bash
docker build -t waifulabs-landing .
```

Run the container:

```bash
docker run -p 3000:3000 waifulabs-landing
```

## Deployment

The application is automatically built and deployed to GitHub Container Registry (ghcr.io) via GitHub Actions when changes are pushed to the main branch or when a new tag is created.

Container images are available at:
```
ghcr.io/waifulabs/landing:latest
```

## Links

- Documentation: [docs.ok8.sh](https://docs.ok8.sh)
- Blog: `/blog`
- Changelog: `/changelog`
