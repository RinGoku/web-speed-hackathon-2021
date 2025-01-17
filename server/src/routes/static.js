import history from 'connect-history-api-fallback';
import Router from 'express-promise-router';
import serveStatic from 'serve-static';
import serveStaticGzip from 'express-static-gzip';

import { CLIENT_DIST_PATH, PUBLIC_PATH, UPLOAD_PATH } from '../paths';

const router = Router();
const compression = require('compression');
router.use(compression({ threshold: 0 }));
// SPA 対応のため、ファイルが存在しないときに index.html を返す
router.use(history());

router.use(
  serveStatic(UPLOAD_PATH, {
    etag: false,
    lastModified: false,
  }),
);

router.use(
  serveStaticGzip(PUBLIC_PATH, {
    etag: false,
    lastModified: false,
  }),
);

router.use(
  serveStaticGzip(CLIENT_DIST_PATH, {
    etag: false,
    lastModified: false,
  }),
);

export { router as staticRouter };
