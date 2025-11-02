import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Card } from "@repo/ui/card";

type Transaction = {
    id: number;
    type: "ADD_TO_WALLET" | "P2P_SENT" | "P2P_RECEIVED";
    amount: number;
    status: "Success" | "Failure" | "Processing";
    timestamp: Date;
    fromUser?: {
        id: number;
        name: string | null;
        number: string;
    };
    toUser?: {
        id: number;
        name: string | null;
        number: string;
    };
    provider?: string;
    paymentMethod?: string;
};

async function getAllTransactions(): Promise<Transaction[]> {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return [];
    }

    // Fetch OnRamp transactions (adding to wallet)
    const onRampTxns = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            startTime: "desc",
        },
    });

    // Fetch P2P transfers (both sent and received)
    const [sentP2P, receivedP2P] = await Promise.all([
        prisma.p2pTransfer.findMany({
            where: {
                fromUserId: userId,
            },
            include: {
                toUser: {
                    select: {
                        id: true,
                        name: true,
                        number: true,
                    },
                },
            },
            orderBy: {
                timestamp: "desc",
            },
        }),
        prisma.p2pTransfer.findMany({
            where: {
                toUserId: userId,
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        name: true,
                        number: true,
                    },
                },
            },
            orderBy: {
                timestamp: "desc",
            },
        }),
    ]);

    const transactions: Transaction[] = [];

    // Add OnRamp transactions
    onRampTxns.forEach((t) => {
        transactions.push({
            id: t.id,
            type: "ADD_TO_WALLET",
            amount: t.amount,
            status: t.status,
            timestamp: t.startTime,
            provider: t.provider,
            paymentMethod: t.provider, // Provider is the bank/payment method
        });
    });

    // Add sent P2P transfers
    sentP2P.forEach((t) => {
        transactions.push({
            id: t.id,
            type: "P2P_SENT",
            amount: t.amount,
            status: "Success", // P2P transfers are always successful once created
            timestamp: t.timestamp,
            toUser: {
                id: t.toUser.id,
                name: t.toUser.name,
                number: t.toUser.number,
            },
            paymentMethod: "Wallet",
        });
    });

    // Add received P2P transfers
    receivedP2P.forEach((t) => {
        transactions.push({
            id: t.id,
            type: "P2P_RECEIVED",
            amount: t.amount,
            status: "Success",
            timestamp: t.timestamp,
            fromUser: {
                id: t.fromUser.id,
                name: t.fromUser.name,
                number: t.fromUser.number,
            },
            paymentMethod: "Wallet",
        });
    });

    // Sort all transactions by timestamp (newest first)
    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function getStatusColor(status: "Success" | "Failure" | "Processing") {
    switch (status) {
        case "Success":
            return "text-green-600 bg-green-100";
        case "Failure":
            return "text-red-600 bg-red-100";
        case "Processing":
            return "text-yellow-600 bg-yellow-100";
    }
}

function getTypeLabel(type: Transaction["type"]) {
    switch (type) {
        case "ADD_TO_WALLET":
            return "Adding to Wallet";
        case "P2P_SENT":
            return "P2P Transfer - Sent";
        case "P2P_RECEIVED":
            return "P2P Transfer - Received";
    }
}

function getAmountDisplay(transaction: Transaction) {
    const amount = `₹ ${transaction.amount / 100}`;
    if (transaction.type === "P2P_SENT") {
        return `- ${amount}`;
    }
    return `+ ${amount}`;
}

export default async function() {
    const transactions = await getAllTransactions();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transactions
            </div>
            <div className="p-4">
                <Card title="All Transactions">
                    {transactions.length === 0 ? (
                        <div className="text-center pb-8 pt-8 text-slate-600">
                            No transactions found
                        </div>
                    ) : (
                        <div className="pt-2 space-y-4">
                            {transactions.map((t) => (
                                <div
                                    key={`${t.type}-${t.id}`}
                                    className="border-b pb-4 last:border-b-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">
                                                    {getTypeLabel(t.type)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                        t.status
                                                    )}`}
                                                >
                                                    {t.status}
                                                </span>
                                            </div>
                                            
                                            {/* Display From/To User information */}
                                            <div className="text-sm text-slate-600 space-y-1">
                                                {t.type === "P2P_SENT" && t.toUser && (
                                                    <div>
                                                        <span className="font-medium">To: </span>
                                                        {t.toUser.name || "Unknown"} ({t.toUser.number})
                                                    </div>
                                                )}
                                                {t.type === "P2P_RECEIVED" && t.fromUser && (
                                                    <div>
                                                        <span className="font-medium">From: </span>
                                                        {t.fromUser.name || "Unknown"} ({t.fromUser.number})
                                                    </div>
                                                )}
                                                
                                                {/* Payment method and provider */}
                                                <div>
                                                    <span className="font-medium">Payment Method: </span>
                                                    {t.paymentMethod || "N/A"}
                                                </div>
                                                {t.provider && (
                                                    <div>
                                                        <span className="font-medium">Bank/Provider: </span>
                                                        {t.provider}
                                                    </div>
                                                )}
                                                
                                                {/* Timestamp */}
                                                <div>
                                                    {t.timestamp.toLocaleString("en-IN", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div
                                                className={`text-lg font-bold ${
                                                    t.type === "P2P_SENT"
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {getAmountDisplay(t)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}