import { useState } from "react";
import Header from "./Header";

const messages = [
  { id: 1, sender: "Bạn", text: "Thuật toán in-place : không cần vùng nhớ nào khác" },
  { id: 2, sender: "Bạn", text: "GRAPE :::::" },
  { id: 3, sender: "Bạn", text: "- Cấu trúc dữ liệu không tuần tự (no linear)" },
  { id: 4, sender: "Bạn", text: "Cấu tạo từ các đỉnh và cạnh" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
  { id: 5, sender: "Bạn", text: "G(V < E)" },
];

const ChatWindow = () => {
//   const { chatId } = useParams();
  const [input, setInput] = useState("");

    return (

    <div className="flex flex-col h-screen bg-gray-100">
            {/* Phần danh sách tin nhắn - cuộn được */}
            <Header title="Chat"/>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-2 my-1 bg-blue-500 text-white rounded-md w-fit ml-auto"
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box - Luôn cố định dưới */}
      <div className="sticky bottom-0 left-0 w-full bg-white border-t p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
