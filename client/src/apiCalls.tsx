const PORT_URL = "http://localhost:3000";

export async function fetchContacts(user: string): Promise<Response> {
  const response = await fetch(`${PORT_URL}/contact/get`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      user,
    }),
  });
  return response;
}

export async function fetchAllUsers(): Promise<Response> {
  const response = await fetch(`${PORT_URL}/users`, {
    method: "Get",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response;
}

export async function fetchCreateNewContact(user: string, contact: string) {
  await fetch(`${PORT_URL}/contact/add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      user,
      contact,
    }),
  });
}

export async function fetchLogin(
  username: string,
  password: string
): Promise<Response> {
  const response = await fetch(`${PORT_URL}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  return response;
}

export async function fetchRegister(
  name: string,
  username: string,
  password: string
): Promise<Response> {
  const response = await fetch(`${PORT_URL}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      name,
      username,
      password,
    }),
  });
  return response;
}

export async function fetchRoomID(
  user1: string,
  user2: string
): Promise<Response> {
  const response = await fetch(`${PORT_URL}/roomID`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      user1,
      user2,
    }),
  });
  return response;
}

export async function fetchMessageHistory(roomID: string): Promise<Response> {
  const response = await fetch(`${PORT_URL}/messages/${roomID}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response;
}

export async function fetchDeleteUser(username: string): Promise<Response> {
  const response = await fetch(`${PORT_URL}/delete`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      username,
    }),
  });

  return response;
}

export async function fetchChangePassword(
  username: string,
  password: string
): Promise<Response> {
  const response = await fetch(`${PORT_URL}/changepassword`, {
    method: "Put",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return response;
}
