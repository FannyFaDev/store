required('dotenv')
const express = require ('express');
const app = express();
const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.send('Hallo Word!');
});

app.listen(port, () =>
    console.log('example app LIstening on port ${port}!'),)