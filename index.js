import express from "express"
import schoolRoutes from "./routes/schoolRoutes.js"
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', schoolRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
