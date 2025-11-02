import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        // First, verify that the token exists in the onRampTransaction table
        const existingTransaction = await db.onRampTransaction.findUnique({
            where: {
                token: paymentInformation.token
            }
        });

        // Verify the transaction exists and details match
        if (!existingTransaction) {
            return res.status(400).json({
                message: "Invalid token: Transaction not found"
            });
        }

        // Verify the userId matches
        if (existingTransaction.userId !== Number(paymentInformation.userId)) {
            return res.status(400).json({
                message: "Invalid transaction: User ID mismatch"
            });
        }

        // Verify the amount matches
        if (existingTransaction.amount !== Number(paymentInformation.amount)) {
            return res.status(400).json({
                message: "Invalid transaction: Amount mismatch"
            });
        }

        // Verify the transaction is still in Processing status (prevent duplicate processing)
        if (existingTransaction.status !== "Processing") {
            return res.status(400).json({
                message: `Invalid transaction: Transaction already ${existingTransaction.status}`
            });
        }

        // All verifications passed, proceed with updates
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId),
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount),
                    },
                    locked: {
                        decrement: Number(paymentInformation.amount),
                    },
                },
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);