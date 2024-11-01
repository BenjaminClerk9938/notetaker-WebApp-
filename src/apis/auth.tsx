export const loginUser = async (username: string) => {
    console.log(username);
  const response = await fetch("https://api.stru.ai/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  localStorage.setItem("username", username);
  return response.json();
};

export const logoutUser = async (username: string) => {
  await fetch("https://api.stru.ai/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Username": username,
    },
    body: JSON.stringify({ username }),
    credentials: "include",
  });
};
