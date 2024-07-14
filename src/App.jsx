import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchChats, getUserMessages } from "./api.js";
import Bars from "./assets/bars.svg";
import Search from "./assets/Search.jsx";
import Back from "./assets/back.svg";
import Pencil from "./assets/pencil.svg";
import Saved from "./assets/saved.svg";
import Add from "./assets/add.svg";
import Animation from "./assets/animation.svg";
import Bug from "./assets/bug.svg";
import Help from "./assets/help.svg";
import K from "./assets/k.svg";
import Night from "./assets/night.svg";
import Person from "./assets/person.svg";
import Play from "./assets/play.svg";
import Settings from "./assets/settings.svg";
import Phone from "./assets/phone.svg";
import Dots from "./assets/dots.svg";
import Mag from "./assets/mag.svg";
import { isMobile } from 'react-device-detect';

const gradientClasses = [
  "from-red-400 to-red-200",
  "from-orange-400 to-orange-200",
  "from-yellow-400 to-yellow-200",
  "from-lime-400 to-lime-200",
  "from-emerald-400 to-emerald-200",
  "from-green-400 to-green-200",
  "from-cyan-400 to-cyan-200",
  "from-indigo-400 to-indigo-200",
  "from-fuchsia-400 to-fuchsia-200",
  "from-rose-400 to-rose-200",
  "from-stone-400 to-stone-200",
];

const MakeSymbol = ({ name, colorCount = 10, size = "small" }) => {
  const gradientIndex = colorCount % gradientClasses.length;
  const symbolSize = size === "big" ? "w-16 h-14 text-xl" : "w-10 h-10 text-lg";

  const initials = name
    ? name
        .trim()
        .split(" ")
        .map((part) => part[0].toUpperCase())
        .join("")
    : "U";

  return (
    <div
      className={`relative bg-gradient-to-br ${gradientClasses[gradientIndex]} flex items-center justify-center rounded-full font-bold text-white ${symbolSize}`}
    >
      <div className="capitalize">{initials}</div>
    </div>
  );
};

const formatDate = (updatedAt) => {
  const date = new Date(updatedAt);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleString("default", { month: "short", day: "numeric" });
  } else {
    return date.getFullYear().toString();
  }
};

const App = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [otherUserId, setOtherUserId] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [otherUserColor, setOtherUserColor] = useState(10);
  const [lastSeen, setLastSeen] = useState("");
  const [newMessage, setNewMessage] = useState(isMobile?true:false);
  const [myMenu, setMyMenu] = useState(false);
  const [userSelected,setUserSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all chats
        let res = await fetchChats(1);
        let tempChats = [];

        if (res.status === "success") {
          const pages = Math.ceil(res.data.total / res.data.per_page);
          tempChats = [...tempChats, ...res.data.data];

          for (let i = 2; i <= pages; i++) {
            res = await fetchChats(i);
            if (res.status === "success") {
              tempChats = [...tempChats, ...res.data.data];
            }
          }

          // Sort chats by updated_at descending
          tempChats.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          setChats(tempChats);

          // Fetch all messages for the first chat (if available)
          if (tempChats.length > 0) {
            const firstChatId = tempChats[0].id;
            await fetchMessages(firstChatId);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, []);

  const fetchMessages = async (chatId) => {
    try {
      const res = await getUserMessages(chatId);

      if (res.status === "success") {
        // Sort messages by updated_at descending
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );

        // Group messages by date
        const groupedMessages = groupMessagesByDate(sortedMessages);

        // Set last seen timestamp
        setLastSeen(sortedMessages[0].updated_at);

        // Set messages state
        setMessages(groupedMessages);
      } else {
        console.error("Error fetching messages:", res.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};

    messages.forEach((message) => {
      const dateKey = message.updated_at.split("T")[0];
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(message);
    });

    return groupedMessages;
  };

  return (
    <div
      className="grid grid-cols-12 w-screen min-h-screen h-screen overflow-hidden"
      onClick={() => {
        setMyMenu(false);
        setSearchActive(false);
      }}
    >
      <div
        className={`col-span-12 sm:col-span-4 border-r border-slate-300 flex flex-col h-screen relative ${isMobile && userSelected ?"hidden":'' } `}
        onMouseEnter={() => {
          setNewMessage(true);
        }}
        onMouseLeave={() => {
          setNewMessage(false);
        }}
      >
        <div className="flex gap-4 px-2 py-2 w-full">
          <div
            className="flex px-2 cursor-pointer hover:bg-slate-100 rounded-full items-center relative"
            onClick={(e) => {
              e.stopPropagation();
              if (searchActive) setSearchActive(false);
              else setMyMenu(!myMenu);
            }}
          >
            <img
              src={searchActive ? Back : Bars}
              alt=""
              className={`w-7 transition-all duration-500 transform ${
                searchActive ? "rotate-180" : "rotate-0"
              }`}
              style={{ opacity: searchActive ? 1 : 0.7 }}
            />
            <div
              className={`absolute top-10 z-50 ${
                myMenu ? "" : "hidden"
              } bg-zinc-100 shadow-md p-1 rounded-xl bg-opacity-90 flex flex-col font-semibold  whitespace-nowrap ${isMobile?"w-80 text-normal":"w-60 text-sm"}`}
            >
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Saved} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Saved Messages</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Person} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Contacts</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Play} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>My Stories</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Settings} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Settings</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Night} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Night Mode</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Animation} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Animation</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Help} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Telegram Features</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Bug} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Report a bug</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={K} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Switch to K Version</div>
              </div>
              <div className="flex gap-3 px-2 hover:bg-zinc-200 rounded-xl py-2">
                <div>
                  <img src={Add} alt="S" className={`${isMobile?"w-6 h-6":"w-5 h-5"}`} />
                </div>
                <div>Install App</div>
              </div>
            </div>
          </div>
          <span
            className={`flex gap-2 px-4 py-2 rounded-full w-full ${
              searchActive ? "bg-white outline outline-blue-500" : "bg-zinc-100"
            }`}
          >
            <Search searchActive={searchActive} />
            <input
              placeholder="Search"
              type="text"
              className="bg-transparent focus:outline-none w-full font-sans"
              onClick={(e) => {
                e.stopPropagation();
                setMyMenu(false);
                setSearchActive(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchActive(false);
              }}
            />
          </span>
        </div>
        <div className="max-h-screen overflow-y-scroll pl-2 pr-1">
          {chats.map((elt) => (
            <div
              key={elt.id}
              className={`flex p-2 gap-2 cursor-pointer ${
                otherUserId === elt.creator.id && !isMobile
                  ? "bg-blue-500  text-white"
                  : "bg-white hover:bg-zinc-100 text-black"
              } rounded-xl`}
              onClick={() => {
                setUserSelected(true)
                setOtherUserId(elt.creator.id);
                setChatId(elt.id);
                fetchMessages(elt.id);
                setOtherUser(elt.creator.name);
                setOtherUserColor(
                  elt.creator.id
                    ? Number(elt.creator.id.toString()[3]) <= 9
                      ? elt.creator.id.toString()[3]
                      : 10
                    : 10
                );
              }}
            >
              <MakeSymbol
                name={elt.creator.name}
                colorCount={
                  elt.creator.id
                    ? Number(elt.creator.id.toString()[3]) <= 9
                      ? elt.creator.id.toString()[3]
                      : 10
                    : 10
                }
                size="big"
              />
              <div className="flex flex-col w-full p-1">
                <div className="flex justify-between">
                  <div className="font-semibold">
                    {elt.creator.name || "Unknown"}
                  </div>
                  <div
                    className={`text-xs ${
                      otherUserId === elt.creator.id && !isMobile
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {formatDate(elt.updated_at)}
                  </div>
                </div>
                <div
                  className={` ${
                    otherUserId === elt.creator.id && !isMobile
                      ? "text-white"
                      : "text-slate-600"
                  }`}
                >
                  {elt.creator.name ? elt.creator.name : "Unknown"} joined
                  Telegram
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`absolute ${
            isMobile || newMessage ? "bottom-5" : "-bottom-20"
          } z-50 right-5 bg-blue-500 rounded-full p-2 transition-[bottom] duration-200 cursor-pointer`}
        >
          <img src={Pencil} alt="New Message" className="w-9" />

        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 relative h-screen">
        <img src="./bg.png" className="w-full h-screen absolute -z-10" alt="" />
        <div
          className={`flex flex-col gap-2 h-full ${
            otherUserId > 0 ? "" : "hidden"
          }`}
        >
          <div className={`fixed flex justify-between bg-white ${isMobile?"w-full px-2":"w-8/12 px-6"}`}>
            <div
              className={`w-fit p-2 text-black font-semibold flex gap-2 items-center`}
            >
              <img src={Back} className={isMobile?"w-5 h-5 rotate-180":"hidden"} alt="" onClick={(e)=>{setUserSelected(false)}}/>
              <MakeSymbol
                name={otherUser}
                colorCount={otherUserColor}
                size="small"
              />
              <div className="flex flex-col">
                <div>{otherUser || "Unknown"}</div>
                <div className="text-xs text-zinc-500 font-normal">
                  at{" "}
                  {new Date(lastSeen).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                    ? new Date(lastSeen).toLocaleTimeString()
                    : new Date(lastSeen).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <img
                src={Mag}
                className="w-6 h-6 cursor-pointer"
                alt="Magnifying Glass"
              />
              <img
                src={Phone}
                className="w-6 h-6 cursor-pointer"
                alt="Phone Icon"
              />
              <img
                src={Dots}
                className="w-6 h-6 cursor-pointer"
                alt="More Options"
              />
            </div>
          </div>

          <div className="h-full overflow-y-auto bg-transparent flex flex-col-reverse gap-7 px-2 pt-16 overflow-x-hidden">
            {/* Render messages grouped by date */}
            {Object.keys(messages).map((date) => (
              <React.Fragment key={date}>
                {messages[date].map((message) => (
                  <div
                    key={message.id}
                    className={`${
                      message.sender.name === otherUser
                        ? "flex-row"
                        : "flex-row-reverse"
                    } flex`}
                  >
                    <div
                      className={`${isMobile?"max-w-[90%]":"max-w-[70%]"} ${
                        message.sender.name === otherUser
                          ? "bg-white"
                          : "bg-green-50"
                      } rounded-xl pr-3 p-2 ${!isMobile &&
                        message.message.length < 50
                          ? "flex flex-row gap-2 whitespace-nowrap"
                          : "flex-flex-col"
                      }`}
                    >
                      {message.message}
                      <div
                        className={`text-xs w-full text-right ${
                          message.sender.name === otherUser
                            ? "text-zinc-500"
                            : "text-green-500"
                        } pt-2`}
                      >
                        {new Date().toDateString() ==
                        new Date(date).toDateString()
                          ? new Date(message.updated_at).toLocaleTimeString()
                          : message.updated_at.split("T")[0]}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-white mt-4 mb-2 px-3 rounded-full place-self-center bg-green-500 py-1">
                  {new Date().toDateString() == new Date(date).toDateString()
                    ? "Today"
                    : new Date(date).toDateString()}
                </div>
              </React.Fragment>
            ))}
          </div>
          <input
            type="text"
            placeholder="Message"
            className="border mx-5 mb-5 mt-1 w-4/5 place-self-center p-3 rounded-xl outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
