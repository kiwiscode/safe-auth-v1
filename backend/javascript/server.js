const app = require("./app");
const { PORT } = require("./constants/env");

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
