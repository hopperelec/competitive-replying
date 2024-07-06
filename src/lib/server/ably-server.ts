import { ABLY_API_KEY } from "$env/static/private";
import ably from "ably";

const ablyServer = new ably.Realtime({ key: ABLY_API_KEY });
export default ablyServer;
