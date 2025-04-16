// context/CallContext.tsx
import { createContext, useContext, useState } from "react";

const CallContext = createContext<any>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const [showCallUI, setShowCallUI] = useState(false);
    const [callInfo, setCallInfo] = useState<{ channelId: string, token: string } | null>(null);

    return (
        <CallContext.Provider value={{ showCallUI, setShowCallUI, callInfo, setCallInfo }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCallContext = () => useContext(CallContext);
