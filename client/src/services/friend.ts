import axios from "@/config/axios.ts";
import { ApiResponse } from "@/types/apiResponse.ts";

export const getFriends = async () => await axios.get<ApiResponse>("/api/friend/v1/get-friends");
