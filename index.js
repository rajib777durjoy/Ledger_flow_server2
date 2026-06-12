import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import sql from "./Db/DB.connect.js";
import { chain } from "./Chain/Chain.js";
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP Server
const httpServer = createServer(app);

// Create Socket.IO Server
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

app.get("/api/get_customer_due/:id", async (req, res) => {
    const clerk_id = req.params.id;
    const queryShopId = await sql`
      select s.id 
      from users_table u 
      join shop_table s on u.id = s.user_id 
      where u.clerk_id = ${clerk_id};
    `;
    const shop_id = queryShopId[0].id
    // console.log('shop_id',shop_id);
    const queryCustomerDue = await sql`select * from customer_due_table where shop_id = ${shop_id} ;`
    if (queryCustomerDue.length > 0) {
        return res.status(200).send(queryCustomerDue);
    }
    res.status(200).send([])
});

// app.post("/api/send_alert_message/:id", async (req, res) => {
//     try {
//         const customerId = req.params.id;

//         // 1. DB fetch (example)
//         const customer = {
//             id: customerId,
//             name: "Rahim",
//             due: 5000,
//             phone: "8801xxxxxxx",
//         };

//         // 2. LangChain run
//         const result = await chain.invoke({
//             name: customer.name,
//             due: customer.due,
//         });

//         // 3. response
//         return res.json({
//             success: true,
//             customer,
//             message: result,
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
// });

// Socket Connection
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    socket.emit("welcome", "Welcome to Socket.IO Server");
    socket.on('send_user', async (data) => {
        const { user_id } = data;
        // console.log('user_id::', user_id)
        const InserSocketId = await sql`UPDATE users_table
      SET socket_id = ${socket.id}
      WHERE id = ${user_id}
    `;
        // console.log('inserSocket', InserSocketId);
    })


    socket.on("disconnect", async () => {
        await sql`UPDATE users_table
      SET socket_id = Null
      WHERE socket_id = ${socket.id}
    `;
        // console.log("User Disconnected:", socket.id);
    });
});

// Use httpServer instead of app.listen
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});