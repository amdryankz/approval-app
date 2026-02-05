import express from 'express';
import Controller from '../controllers/controller';

const router = express.Router();

router.get("/employees", Controller.getAllEmployees)
router.get("/requests", Controller.getRequestEmployee)
router.get("/requests/:id", Controller.getRequestById)
router.post("/requests", Controller.createRequest)
router.put("/requests/:id/approved", Controller.approveRequest)
router.delete("/requests/:id", Controller.deleteRequest)

export default router;