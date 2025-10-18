#!/usr/bin/env node
/**
 * Simple Development Server for Monolithic Frontend Template
 * A lightweight HTTP server for local development and testing.
 * 
 * Usage:
 *   node dev-server.js [port]
 *   npm start [port]
 * 
 * Default port: 8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

class DevServer {
    constructor(port = 8000) {
        this.port = port;
        this.projectRoot = __dirname;
        this.server = null;
    }

    /**
     * Check if project structure is valid
     */
    checkProjectStructure() {
        const requiredFiles = ['index.html', 'assets', 'src', 'pages'];
        const missingFiles = [];

        for (const file of requiredFiles) {
            const filePath = path.join(this.projectRoot, file);
            if (!fs.existsSync(filePath)) {
                missingFiles.push(file);
            }
        }

        if (missingFiles.length > 0) {
            console.log('⚠️  Warning: Some project files are missing:');
            missingFiles.forEach(file => console.log(`   - ${file}`));
            console.log('   Make sure you\'re running this from the project root directory.');
            return false;
        }

        return true;
    }

    /**
     * Find an available port
     */
    async findAvailablePort(preferredPort = 8000) {
        const net = require('net');

        for (let port = preferredPort; port < preferredPort + 100; port++) {
            if (await this.isPortAvailable(port)) {
                return port;
            }
        }

        throw new Error('No available ports found');
    }

    /**
     * Check if a port is available
     */
    isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = require('net').createServer();
            server.listen(port, () => {
                server.once('close', () => resolve(true));
                server.close();
            });
            server.on('error', () => resolve(false));
        });
    }

    /**
     * Get MIME type for file extension
     */
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        return mimeTypes[ext] || 'text/plain';
    }

    /**
     * Handle HTTP requests
     */
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;

        // Add CORS headers for development
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Disable caching for development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Default to index.html for root
        if (pathname === '/') {
            pathname = '/index.html';
        }

        // Construct file path
        const filePath = path.join(this.projectRoot, pathname);

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 - Not Found</title></head>
                        <body>
                            <h1>404 - File Not Found</h1>
                            <p>The requested file <code>${pathname}</code> was not found.</p>
                            <p><a href="/">← Back to Home</a></p>
                        </body>
                    </html>
                `);
                this.logRequest(req, 404);
                return;
            }

            // Read and serve file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(`
                        <html>
                            <head><title>500 - Server Error</title></head>
                            <body>
                                <h1>500 - Internal Server Error</h1>
                                <p>Error reading file: ${err.message}</p>
                            </body>
                        </html>
                    `);
                    this.logRequest(req, 500);
                    return;
                }

                // Set content type and send file
                const mimeType = this.getMimeType(filePath);
                res.writeHead(200, { 'Content-Type': mimeType });
                res.end(data);
                this.logRequest(req, 200);
            });
        });
    }

    /**
     * Log HTTP requests
     */
    logRequest(req, statusCode) {
        const timestamp = new Date().toLocaleString();
        const method = req.method;
        const url = req.url;
        const status = statusCode;
        
        const statusEmoji = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
        console.log(`[${timestamp}] ${statusEmoji} ${method} ${url} - ${status}`);
    }

    /**
     * Open browser
     */
    openBrowser(url) {
        const delay = 1500;
        setTimeout(() => {
            const start = process.platform === 'darwin' ? 'open' : 
                         process.platform === 'win32' ? 'start' : 'xdg-open';
            
            const child = spawn(start, [url], { stdio: 'ignore', detached: true });
            child.unref();
            
            console.log(`🌐 Opened ${url} in your default browser`);
        }, delay);
    }

    /**
     * Print server information
     */
    printServerInfo() {
        console.log('🚀 Monolithic Frontend Development Server');
        console.log('='.repeat(50));
        console.log(`📁 Serving directory: ${this.projectRoot}`);
        console.log(`🌐 Local URL: http://localhost:${this.port}`);
        console.log(`🔗 Network URL: http://127.0.0.1:${this.port}`);
        console.log('='.repeat(50));
        console.log('📝 Quick Start:');
        console.log(`   • Main page: http://localhost:${this.port}/`);
        console.log(`   • About page: http://localhost:${this.port}/pages/about.html`);
        console.log(`   • Services page: http://localhost:${this.port}/pages/services.html`);
        console.log(`   • Contact page: http://localhost:${this.port}/pages/contact.html`);
        console.log('='.repeat(50));
        console.log('🛠️  Development Tips:');
        console.log('   • Edit files and refresh browser to see changes');
        console.log('   • Use browser dev tools for debugging');
        console.log('   • Check console for JavaScript errors');
        console.log('   • Press Ctrl+C to stop the server');
        console.log('='.repeat(50));
    }

    /**
     * Start the development server
     */
    async start() {
        try {
            // Check project structure
            if (!this.checkProjectStructure()) {
                console.log('\n💡 Tip: Make sure you\'re in the project root directory with index.html');
            }

            // Find available port
            this.port = await this.findAvailablePort(this.port);

            // Create server
            this.server = http.createServer((req, res) => this.handleRequest(req, res));

            // Start server
            this.server.listen(this.port, () => {
                this.printServerInfo();
                console.log(`✅ Server started successfully on port ${this.port}`);
                console.log('   Press Ctrl+C to stop the server');
                console.log();

                // Open browser
                this.openBrowser(`http://localhost:${this.port}`);
            });

            // Handle server errors
            this.server.on('error', (err) => {
                console.error(`❌ Server error: ${err.message}`);
                process.exit(1);
            });

            // Handle graceful shutdown
            process.on('SIGINT', () => {
                console.log('\n🛑 Server stopped by user');
                console.log('👋 Thanks for using the Monolithic Frontend Template!');
                process.exit(0);
            });

        } catch (error) {
            console.error(`❌ Error starting server: ${error.message}`);
            process.exit(1);
        }
    }
}

// Main execution
function main() {
    // Get port from command line arguments
    let port = 8000;
    const portArg = process.argv[2];
    
    if (portArg) {
        const parsedPort = parseInt(portArg, 10);
        if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
            console.log(`⚠️  Invalid port number: ${portArg}. Using default port 8000.`);
        } else {
            port = parsedPort;
        }
    }

    // Create and start server
    const devServer = new DevServer(port);
    devServer.start();
}

// Only run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = DevServer;
