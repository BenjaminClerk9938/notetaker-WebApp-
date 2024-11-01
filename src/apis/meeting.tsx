import { Meeting } from "../types";

export const fetchMeetings = async (username: string): Promise<Meeting[]> => {
  console.log("fetchMeeting is called");
  const response = await fetch("https://api.stru.ai/api/meetings/user", {
    headers: {
      "X-Username": username,
    },
    method: "GET",
    // credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }
  console.log(response);
  return response.json();
};
export const joinMeeting = async (meetingId: string, username: string) => {
  const response = await fetch(
    `https://api.stru.ai/api/meetings/${meetingId}/participants/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Username": username,
      },
      body: JSON.stringify({
        username,
        meeting_id: meetingId,
      }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to join meeting");
  }

  return response.json();
};
