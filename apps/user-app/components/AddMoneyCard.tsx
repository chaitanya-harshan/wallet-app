"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState, useRef } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";
import { useSession } from "next-auth/react";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const { data: session } = useSession();
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async () => {
        if (amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        const result = await createOnRampTransaction(amount * 100, provider);
        
        if (result?.token && formRef.current) {
            // Set the token value directly in the form input before submission
            // This is reliable for hidden form fields used only for POST submission
            const tokenInput = formRef.current.querySelector<HTMLInputElement>('input[name="token"]');
            if (tokenInput) {
                tokenInput.value = result.token;
            }
            formRef.current.submit();
        }
    };

    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
            setAmount(Number(value))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={handleSubmit}>
            Add Money
            </Button>
        </div>
        
        {/* Hidden form for POST submission */}
        <form ref={formRef} method="POST" action={redirectUrl || ""} style={{ display: 'none' }}>
            <input type="hidden" name="token" value="" />
            <input type="hidden" name="amount" value={amount * 100} />
            <input type="hidden" name="user_identifier" value={(session?.user as any)?.id || ""} />
            <input type="hidden" name="from_account" value={session?.user?.email || (session?.user as any)?.id || ""} />
            <input type="hidden" name="to_account" value="WALLET_ACCOUNT" />
            <input type="hidden" name="description" value={`Add money to wallet via ${provider}`} />
            <input type="hidden" name="provider" value={provider} />
            <input type="hidden" name="user_id" value={(session?.user as any)?.id || ""} />
            <input type="hidden" name="user_name" value={session?.user?.name || ""} />
        </form>
    </div>
</Card>
}