# Kabeer Chats

A free and open-source chat's app - by Kabeer's Network. Project started as a fork
of [Chakra Chat](https://github.com/bscottnz/nextjs-chakra-chatapp)

![Conversation Image 1](./documentation/images/conversation-screenshot-1.png)
![Conversation Image 2](./documentation/images/conversation-screenshot-2.png)

## Code-base and services

Code contains multiple services hosted separately

| Folders       |                                                                                                                     |
|---------------|---------------------------------------------------------------------------------------------------------------------|
| `designs`     | Contains wallpaper images, designs and audios for app-wide usage                                                    |
| `credentials` | Contains service wide credentials                                                                                   |
| `emulator`    | Contains Firebase emulator code and startup scripts                                                                 |
| `native`      | Native app code derived from `web`                                                                                  |
| `push`        | Push notification service, used to send data notifications for chat messages, and call alerts                       |
| `peer`        | Contains PeerServer code and startup scripts                                                                        |
| `schema`      | Contains client and server data schema's used as reference service-wide                                             |
| `scripts`     | Miscellaneous startup and shutdown scripts for code-source                                                          |
| `web`         | Web code, this is the main frontend code, its stable release is embedded and used in the `native` build             |
| `wildflower`  | Wildflower is a WebRTC SFU responsible for notification service V2 . Currently in early alpha                       |
| `config`      | Contains PHP server code for `remote-config` server, used by services like `web` and `native` for configuring API   |

---
<small>(c) 2022 Kabeer's Network</small>