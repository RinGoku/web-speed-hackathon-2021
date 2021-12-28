import history from 'connect-history-api-fallback';
import Router from 'express-promise-router';
import serveStatic from 'serve-static';
const expressStaticGzip = require('express-static-gzip');

import { CLIENT_DIST_PATH, PUBLIC_PATH, UPLOAD_PATH } from '../paths';

const router = Router();

// SPA 対応のため、ファイルが存在しないときに index.html を返す
router.use(history());

router.use(
  serveStatic(UPLOAD_PATH, {
    etag: false,
    lastModified: false,
  }),
);

router.use(
  expressStaticGzip(PUBLIC_PATH, {
    etag: false,
    lastModified: false,
  }),
);

router.use(
  expressStaticGzip(CLIENT_DIST_PATH, {
    etag: false,
    lastModified: false,
  }),
);

export { router as staticRouter };
