
const socket = io.connect();

const chatUserName = document.querySelector(".chat_user_name")
const chatJoinedTime = document.querySelector(".chat_user_time")
const chatBodyScroll = document.querySelector(".chatBody")
const chatBody = document.querySelector(".chatBodyMessagesHistory")
const inputField = document.querySelector(".message_form__input")
const messageForm = document.querySelector(".chat_message_form")
const fallback = document.querySelector(".user_typing")
const clockDisplayInput = document.querySelectorAll('input[name="clockDisplay"]')
const onEnterSend = document.querySelectorAll('input[name="onEnterSend"]')
const resetDefaultBtn = document.querySelector(".reset_btn")
const userNameForm = document.querySelector(".change_username_form")
const userNameInput = document.querySelector(".username_input")

const cacheStorage = new CacheStorage("chat-settings")

let userName = "" 
let activeUsers = []

const newUserConnected = (user) => {
  userName = user || `Guest${genRandomInt()}`
  chatUserName.innerHTML = userName
  chatJoinedTime.innerHTML = `Today ${humanReadableTime()}`
  chatUserName.classList.add(`user-${userName}`)
  socket.emit("new user", userName);
  notifyChannel(userName);
};

const notifyChannel = (userName="", msg="joined the chat") => {
    if (!!document.querySelector(`.${userName}-userlist`)) {
      return;
    }
  
    const newUserNotify = `
      <div class="chatNotify ${userName}-userlist">
        <h5>${userName} ${msg}</h5>
      </div>
    `;
    chatBody.innerHTML += newUserNotify;
};
  
// new user is created so we generate username and emit event
newUserConnected();

/**
 * Method to build new message as html string and append to the DOM
 * @param {*} param0 
 */
const appendNewMessage = ({ user, message }) => {
    const formattedTime = humanReadableTime();

    let newMessage = message
    // If message contains image link, render image
    if (newMessage.toLowerCase().match(/\.(jpg|png|gif|jpeg)/g)) {
        newMessage = createImage(message, "hello")
    }
  
    const receivedMsg = `
        <div class="messageContainer">
            <div class="d-flex justify-content-between chat_sender_details">
                <div class="msg_sender_name"><h6>${user}</h6></div>
                <div>${formattedTime}</div>
            </div>
            <div class="message self">${newMessage}</div>
        </div>`;
  
    const myMsg = `
        <div class="messageContainer containerOthers">
            <div class="d-flex justify-content-between chat_sender_details">
                <div class="msg_sender_name"><h6>${user}</h6></div>
                <div>${formattedTime}</div>
            </div>
            <div class="message others">${newMessage}</div>
        </div>`;
  
    const finalMessage = user === userName ? myMsg : receivedMsg
    chatBody.innerHTML += finalMessage
};

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
      return;
    }
  
    socket.emit("chat message", {
      message: inputField.value,
      nick: userName,
    });
  
    inputField.value = "";
});

/**
 * Add keypress event listener to input as user types
 * and emit typing event with payload
 */
inputField.addEventListener("keyup", () => {
    socket.emit("typing", {
        isTyping: inputField.value.length > 0,
        nick: userName,
    });
});

socket.on("chat message", function (data) {
    appendNewMessage({ user: data.nick, message: data.message });
    chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
});

socket.on("typing", function (data) {
    const { isTyping, nick } = data;
  
    if (!isTyping) {
      fallback.innerHTML = "";
      return;
    }
  
    fallback.innerHTML = `
    <div class="message stack">
        <div class="typing typing-1"></div>
        <div class="typing typing-2"></div>
        <div class="typing typing-3"></div>
    </div>`;
});

socket.on("new user", function (data) {
    activeUsers = [...data]
    data.map((user) => notifyChannel(user));
});

socket.on("user disconnected", function (userName) {
    if(userName !== null && typeof userName !== "undefined") {
        notifyChannel(userName, "has left the chat");
    }
});

// On username update, update the username in DOM realtime
socket.on("updated user", function (data) {
    const userElement = document.querySelector(`.user-${userName}`)
    notifyChannel("", `${data.oldUsername} changed to ${data.newUsername}`)

    if(data.oldUsername.toLowerCase() == userName.toLowerCase()) {
        userElement.innerHTML = data.newUsername
        userElement.classList.add(`user-${data.newUsername.replace(/\s/g, '')}`)
        userElement.classList.remove(`user-${userName.replace(/\s/g, '')}`)
        userName = data.newUsername;

        alert("Username changed successfully")
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
    }
})

/**
 * Retrieve user previous settings from storage,
 * If user have no previous setting, set the default settings to storage and set the checked value on the settings form
 * Else pick user settings from storage and set value to form
 */
const hasDefaultSettings = cacheStorage.getValueFromStorage()
const userDefaultSettings = {
    clockDisplay: 12,
    onEnterSend: "on"
}
if(!hasDefaultSettings) {
    const result = cacheStorage.setValueToStorage(userDefaultSettings)

    if(result) {
        setCheckedValueOfRadioButtonGroup("clockDisplay", userDefaultSettings.clockDisplay)
        setCheckedValueOfRadioButtonGroup("onEnterSend", userDefaultSettings.onEnterSend)
    }
} else {
    let result = cacheStorage.getValueFromStorage()
    result = result ? JSON.parse(result) : {}
    setCheckedValueOfRadioButtonGroup("clockDisplay", result.clockDisplay)
    setCheckedValueOfRadioButtonGroup("onEnterSend", result.onEnterSend)
}

/**
 * On clockDisplayInput change, set value in storage to the selected value
 */
if(clockDisplayInput) {
    clockDisplayInput.forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const selectedValue = event.target.value;
            console.log(selectedValue);
            cacheStorage.setValueToStorage({
                clockDisplay: selectedValue
            })
            setCheckedValueOfRadioButtonGroup("clockDisplay", selectedValue)
        });
      });
}

/**
 * onEnterSend input change, set value in storage to the selected value
 */
if(onEnterSend) {
    onEnterSend.forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const selectedValue = event.target.value;
            cacheStorage.setValueToStorage({
                onEnterSend: selectedValue
            })
            setCheckedValueOfRadioButtonGroup("onEnterSend", selectedValue)
        });
      });
}

/**
 * Eventlistener attached to reset button to restore user's default settings
 */
resetDefaultBtn.addEventListener("click", (e) => {
    const result = cacheStorage.setValueToStorage(userDefaultSettings)
  
    if(result) {
        setCheckedValueOfRadioButtonGroup("clockDisplay", userDefaultSettings.clockDisplay)
        setCheckedValueOfRadioButtonGroup("onEnterSend", userDefaultSettings.onEnterSend)
    }
});

/**
 * Eventlistener to handle username change
 */
userNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { value } = userNameInput
    if (!value) {
      return;
    }

    activeUsers = activeUsers.map(user => user.toLowerCase())

    if(activeUsers.includes(value.toLowerCase())) {
        alert('Username already exists, Use a unique username')
        return
    }

    socket.emit("username changed", {
        oldUsername: userName,
        newUsername: userNameInput.value
    });
  
    userNameInput.value = "";
});