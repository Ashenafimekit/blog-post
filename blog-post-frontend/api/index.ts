import { API_URL } from "@/constant/api-url";
import { useSessionData } from "@/hooks/useSession";
import axios from "axios";

export const FetchPosts = async ({
  page,
  limit,
  session,
}: {
  page: number;
  limit: number;
  session: ReturnType<typeof useSessionData>;
}) => {
  try {
    const res = await axios.get(`${API_URL}/post`, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
      params: { page, limit },
    });
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 401) {
      console.log("unauthorized access");
    } else if (res.status === 403) {
      console.log("Forbidden access");
    } else {
      console.log("Error fetching posts");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export const FetchPostsCount = async ({
  session,
}: {
  session: ReturnType<typeof useSessionData>;
}) => {
  try {
    const res = await axios.get(`${API_URL}/post/count`, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 401) {
      console.log("unauthorized access");
    }
  } catch (error) {
    console.error("Error fetching posts count:", error);
  }
};
