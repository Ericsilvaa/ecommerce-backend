

import { Router } from 'express';
import adminRoutes from './admin.routes';
import ambassadorRoutes from './ambassador.routes';
import checkoutRoutes from './checkout.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send('This is the root route!');
});

router.use('admin', adminRoutes);
router.use('ambassador', ambassadorRoutes);
router.use('checkout', checkoutRoutes);

export default router;