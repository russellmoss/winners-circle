# Milea Wine Club Analysis

An interactive React application that presents a comprehensive analysis of the Winner's Circle Club, Milea Estate's ultra-premium membership tier.

## Features

- Detailed presentation of the Winner's Circle Club analysis
- Interactive charts and visualizations using recharts
- Responsive design for all device sizes
- Smooth navigation between sections

## Project Structure

- `src/App.js` - Main application component
- `src/index.js` - Application entry point
- `public/index.html` - HTML template
- `tailwind.config.js` - Tailwind CSS configuration
- `netlify.toml` - Netlify deployment configuration

## Technologies Used

- React
- Tailwind CSS
- Recharts for data visualization
- Netlify for deployment

## Local Development

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/milea-wine-club-analysis.git
   cd milea-wine-club-analysis
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open http://localhost:3000 to view the application in your browser

## Build for Production

To create a production build:

```
npm run build
```
or
```
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment to Netlify

This project is configured for easy deployment to Netlify:

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

Alternatively, you can deploy from the command line using the Netlify CLI:

1. Install the Netlify CLI
   ```
   npm install netlify-cli -g
   ```

2. Build your site
   ```
   npm run build
   ```

3. Deploy to Netlify
   ```
   netlify deploy
   ```

## Customization

- Update the data in the charts by modifying the data arrays in `App.js`
- Modify the styling by editing the Tailwind classes or adding custom CSS
- Add additional sections or charts as needed