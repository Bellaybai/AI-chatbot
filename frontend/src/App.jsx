import { useState } from "react"; // Import useState hook from React
import "./App.css"; // Import CSS file for styling

function App() {
  // Declare state variables
  const [message, setMessage] = useState(""); // State for input message
  const [chats, setChats] = useState([]); // State for storing chat history
  const [isTyping, setIsTyping] = useState(false); // State to indicate if bot is typing

  // Function to handle chat submission
  const chat = async (e, message) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!message) return; // Do nothing if message is empty
    setIsTyping(true); // Set typing indicator to true
    scrollTo(0, 1e10); // Scroll to bottom of chat (assuming infinite scrolling)

    // Add user message to chat array
    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs); // Update chat state

    setMessage(""); // Clear input message

    // Fetch response from backend
    fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json()) // Parse response as JSON
      .then((data) => {
        // Add bot response to chat array
        msgs.push(data.output);
        setChats(msgs); // Update chat state
        setIsTyping(false); // Set typing indicator to false
        scrollTo(0, 1e10); // Scroll to bottom of chat
      })
      .catch((error) => {
        console.log(error); // Log any errors
      });
  };

  return (
    <main>
      <h1>FullStack AI Chatbot</h1>

      <section>
        {/* Render chat messages */}
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      {/* Display typing indicator */}
      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      {/* Input form for sending message */}
      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)} // Update input state on change
        />
      </form>
    </main>
  );
}

export default App; // Export the App component
