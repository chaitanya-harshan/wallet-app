import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Card } from "@repo/ui/card";

async function getBalanceData() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return {
            totalAmount: 0,
            locked: 0,
            unlocked: 0,
            totalReceived: 0,
            totalSent: 0,
        };
    }

    // Get user balance
    const balance = await prisma.balance.findFirst({
        where: {
            userId: userId,
        },
    });

    const unlocked = balance?.amount || 0;
    const locked = balance?.locked || 0;
    const totalAmount = unlocked + locked;

    // Get all P2P transfers
    const [sentP2P, receivedP2P] = await Promise.all([
        prisma.p2pTransfer.findMany({
            where: {
                fromUserId: userId,
            },
            select: {
                amount: true,
            },
        }),
        prisma.p2pTransfer.findMany({
            where: {
                toUserId: userId,
            },
            select: {
                amount: true,
            },
        }),
    ]);

    // Get successful OnRamp transactions (money received from banks)
    const successfulOnRamp = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId,
            status: "Success",
        },
        select: {
            amount: true,
        },
    });

    // Calculate totals
    const totalSent = sentP2P.reduce((sum, t) => sum + t.amount, 0);
    const totalReceivedP2P = receivedP2P.reduce((sum, t) => sum + t.amount, 0);
    const totalReceivedOnRamp = successfulOnRamp.reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = totalReceivedP2P + totalReceivedOnRamp;

    return {
        totalAmount,
        locked,
        unlocked,
        totalReceived,
        totalSent,
    };
}

function StatCard({ title, amount, icon, color }: { title: string; amount: number; icon: React.ReactNode; color: string }) {
    return (
        <Card title={title}>
            <div className="flex items-center justify-between pt-4">
                <div className={`text-3xl font-bold ${color}`}>
                    ₹{(amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-gray-400">
                    {icon}
                </div>
            </div>
        </Card>
    );
}

function TotalBalanceIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>

    );
}

function LockedBalanceIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>

    );
}

function AvailableBalanceIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>

    );
}

function TotalReceivedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    );
}

function TotalSentIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
    );
}

export default async function Dashboard() {
    const { totalAmount, locked, unlocked, totalReceived, totalSent } = await getBalanceData();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Dashboard
            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Balance"
                        amount={totalAmount}
                        icon={<TotalBalanceIcon />}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Locked Balance"
                        amount={locked}
                        icon={<LockedBalanceIcon />}
                        color="text-amber-600"
                    />
                    <StatCard
                        title="Available Balance"
                        amount={unlocked}
                        icon={<AvailableBalanceIcon />}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Total Received"
                        amount={totalReceived}
                        icon={<TotalReceivedIcon />}
                        color="text-emerald-600"
                    />
                    <StatCard
                        title="Total Sent"
                        amount={totalSent}
                        icon={<TotalSentIcon />}
                        color="text-red-600"
                    />
                </div>
            </div>
        </div>
    );
}