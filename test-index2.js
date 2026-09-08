const express = require('express');
const app = express();
const router = express.Router();
router.get('/test', (req, res) => res.send('working'));
app.use('/auth', router);

app.listen(3002, () => console.log('3002'));
