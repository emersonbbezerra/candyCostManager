import { app } from './app';
import { connect } from './infra/database/mongoose';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
