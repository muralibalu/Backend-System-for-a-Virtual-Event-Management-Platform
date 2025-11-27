const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');


const app = express();
app.use(bodyParser());


app.use('/api', authRoutes);
app.use('/api', eventRoutes);


// health
app.get('/health', (req, res) => res.json({ ok: true }));


if (require.main === module) {
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}


module.exports = app;