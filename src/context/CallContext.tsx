// context/CallContext.tsx
import { createContext, useContext, useState } from "react";


type CallInfo = {
    channelId: string;
    token: string;
    conversationId: string; // 👈 Thêm vào đây
};

const CallContext = createContext<{
    showCallUI: boolean;
    setShowCallUI: (val: boolean) => void;
    callInfo: CallInfo | null;
    setCallInfo: (info: CallInfo | null) => void;
} | null>(null);


export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const [showCallUI, setShowCallUI] = useState(false);
    const [callInfo, setCallInfo] = useState<CallInfo | null>(null);

    return (
        <CallContext.Provider value={{ showCallUI, setShowCallUI, callInfo, setCallInfo }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCallContext = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCallContext must be used within a CallProvider");
    }
    return context;
};
