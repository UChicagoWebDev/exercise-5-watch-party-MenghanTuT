/* For room.html */

// TODO: Fetch the list of existing chat messages.
// POST to the API when the user posts a new message.
// Automatically poll for new messages on a regular interval.
// Allow changing the name of a room
async function postMessage(content) {
  try {
      let roomId = document.body.getAttribute('data-room-id');
      console.log(roomId, 'xxxxxxx', content)
      await fetch(`/api/rooms/${roomId}/messages`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({message: content})
      });
      getMessages(roomId); // Refresh the messages list
  } catch (error) {
      console.error('Error posting message:', error);
  }
}

async function getMessages(roomId) {
  try {
      const response = await fetch(`/api/rooms/${roomId}/messages`);
      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }
      const messages = await response.json();
      // Clear existing messages
      document.getElementById('messages').innerHTML = '';
      console.log(messages)
      // Append new messages
      messages.forEach(msg => {
          const messageElement = document.createElement('message');
          const messageAuthor = document.createElement('author');
          messageAuthor.textContent = msg.name
          messageElement.appendChild(messageAuthor);
          const messageContent = document.createElement('content');
          messageContent.textContent = msg.body
          messageElement.appendChild(messageContent);
          document.getElementById('messages').appendChild(messageElement);
      });
  } catch (error) {
      console.error('Error fetching messages:', error);
  }
}

function startMessagePolling() {
  let roomId = document.body.getAttribute('data-room-id');
  // debug
  // console.log('data-room-id', roomId)
  setInterval(() => {
      getMessages(roomId);
  }, 100); //check every 100ms
}

async function updateRoomName(roomId, newName) {
  try {
      await fetch(`/api/rooms/${roomId}/name`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({new_name: newName})
      });
      alert('Room name updated successfully!');
  } catch (error) {
      console.error('Error updating room name:', error);
  }
}

/* For profile.html */
async function updateUsername(newUsername) {
  try {
      const response = await fetch('/api/user/name', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({new_name: newUsername})
      });
      const data = await response.json();
      if(response.ok) {
          alert('Username updated successfully!');
      } else {
          throw new Error(data.message || 'Failed to update username');
      }
  } catch (error) {
      console.error('Error updating username:', error);
      alert(error.message);
  }
}

async function updatePassword(newPassword) {
  try {
      const response = await fetch('/api/user/password', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({new_password: newPassword})
      });
      const data = await response.json();
      if(response.ok) {
          alert('Password updated successfully!');
      } else {
          throw new Error(data.message || 'Failed to update password');
      }
  } catch (error) {
      console.error('Error updating password:', error);
      alert(error.message);
  }
}
// TODO: Allow updating the username and password


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('updateUsernameBtn').addEventListener('click', async () => {
      const newUsername = document.getElementById('newUsername').value;
      await updateUsername(newUsername);
  });

  document.getElementById('updatePasswordBtn').addEventListener('click', async () => {
      const newPassword = document.getElementById('newPassword').value;
      await updatePassword(newPassword);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('messageForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the form from submitting the traditional way
      let content = document.getElementById('messageContent').value;
      await postMessage(content);
      document.getElementById('messageContent').value = ''; // Clear the textarea after sending
  });
});