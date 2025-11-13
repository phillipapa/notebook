import type { IncomingMessage, ServerResponse } from 'http';
import { createProxyMiddleware, type RequestHandler } from 'http-proxy-middleware';

module.exports = function (app: { use: (path: string, proxyMw: RequestHandler<IncomingMessage, ServerResponse<IncomingMessage>, (err?: any) => void>) => void; }) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};
