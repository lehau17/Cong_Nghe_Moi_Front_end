import { useState } from "react";

const reactions = ["👍", "❤️", "😂", "😮", "😭", "😡"];

export default function ReactionButton({
    onReact,
}: {
    onReact?: (emoji: string) => void;
}) {
    const [showPanel, setShowPanel] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setShowPanel(true)}
            onMouseLeave={() => setShowPanel(false)}
        >
            {/* Reaction panel */}
            {showPanel && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex bg-white shadow-lg rounded-full px-3 py-2 gap-2 z-50 animate-fade-in">
                    {reactions.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => onReact?.(emoji)}
                            className="hover:scale-125 transition text-xl"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Trigger button */}
            <button className="bg-white border border-gray-300 shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                👍
            </button>
        </div>
    );
}
