const express = require('express');
const app = express();

app.use(express.json());

app.get('/foo', (req, res) => {
  res.json('foo');
});

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
