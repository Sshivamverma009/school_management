import express from "express"
import schoolRoutes from "./routes/schoolRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', schoolRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
