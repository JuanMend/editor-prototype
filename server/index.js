const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.get('/foo', (req, res) => {
  res.json('foo');
});

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
