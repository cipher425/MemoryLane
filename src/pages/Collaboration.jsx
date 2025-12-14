import { useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";

export default function Collaboration() {
  const [open, setOpen] = useState(false);

  const memories = [
    { id: 1, name: "Mom", date: "12 Jan 2024", text: "A lovely family photo 💙" },
    { id: 2, name: "Dad", date: "15 Jan 2024", text: "Video from vacation 🌴" },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <main className="p-6 max-w-3xl mx-auto">
        
        <h2 className="text-2xl font-semibold text-gray-700">
          Family Memories Capsule
        </h2>
        <p className="text-gray-500 mb-6">
          A shared space for our precious moments
        </p>

        
        <div className="flex gap-3 mb-6">
          {["👩", "👨", "👧"].map((icon, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow"
            >
              {icon}
            </div>
          ))}
        </div>

        
        <button
          onClick={() => setOpen(true)}
          className="mb-8 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          + Add Memory
        </button>

        
        <div className="space-y-4">
          {memories.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <p className="font-medium text-gray-700">{m.name}</p>
              <p className="text-xs text-gray-400">{m.date}</p>
              <p className="text-gray-600 mt-2">{m.text}</p>
            </div>
          ))}
        </div>
      </main>

      
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">
          Add Memory
        </h3>

        <select className="w-full p-3 border rounded-xl mb-3">
          <option>Photo</option>
          <option>Video</option>
          <option>Text</option>
          <option>Audio</option>
        </select>

        <textarea
          placeholder="Write something..."
          className="w-full p-3 border rounded-xl"
        />

        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl">
          Save Memory
        </button>
      </Modal>
    </div>
  );
}
