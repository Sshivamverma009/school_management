import express from "express"
import bodyParser  from "body-parser";
import schoolRoutes from "./routes/schoolRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use('/api', schoolRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
