export async function fetchChats(page){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      return fetch(`https://devapi.beyondchats.com/api/get_all_chats?page=${page}`, requestOptions)
        .then((response) => response.json())
        .then((result) => (result))
        .catch((error) => console.log(error));
}

export async function getUserMessages(id){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  return fetch(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => (result))
    .catch((error) => console.error(error));
}