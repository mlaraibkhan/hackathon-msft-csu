# hackathon-msft-csu

This Codespace Repo comes with some great AI Tools pre-installed.

## GitHub Spec Kit

Before coding a bunch with AI, it is important to first spec out what you want to build.
GitHub Spec Kit helps with this and is available in the terminal.

First set up Spec Kit with `specify init .` in a terminal.

Then, you can open Copilot Chat.

## Copilot Chat

Copilot Chat can be acccessed by toggling the chat. If you are unfamiliar with AI coding, this is a great starting point.

<img width="565" height="66" alt="image" src="https://github.com/user-attachments/assets/39887cd7-704a-4d34-83f7-92acd7b1ccd7" />

Make sure the chat is in "Agent" mode:

<img width="688" height="145" alt="image" src="https://github.com/user-attachments/assets/12c4adfb-ab87-4345-ae76-25976bfaec31" />

I generally recommend using Claude Sonnet 4.5 or GPT-5 Codex.

## Using Spec Kit & Chat Together

If you initialized Spec Kit properly, you can now run various slash commands inside of Copilot:

<img width="709" height="325" alt="image" src="https://github.com/user-attachments/assets/2932b142-41be-4d98-9b72-9bf4cbc506fc" />

Execute these prompts in order with your project idea:

1. Create the spec
Use the `/speckit.specify` command to describe what you want to build. Focus on the what and why, not the tech stack.

`/speckit.specify` Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.

2. Create a technical implementation plan
Use the `/speckit.plan` command to provide your tech stack and architecture choices.

`/speckit.plan` The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.

3. Break down into tasks
Use `/speckit.tasks` to create an actionable task list from your implementation plan.

4. Implement

Use `/speckit.implement` to execute all tasks and build your feature according to the plan.

5. Iterate!

You can continue iterating on your project with Copilot Chat or Copilot CLI:

## Copilot CLI

This is my favorite way to do AI Coding because it has so much potential as a terminal tool.
You can open the CLI by typing `copilot` in a terminal, and even run multiple sessions at once!
To run Copilot and auto-approve all tools, you can run `copilot --allow-all-tools`.
Note that this can be quite dangerous as you allow the AI to run everything it wants autonomously.
If you are in a Codespace, this is relatively safe.

## Context7 MCP Server

To get you used to working with MCP servers, which extend AI coding agents, the Context7 MCP server is pre-installed.
This allows you to make the AI model aware of latest documentation. You can explicitly call it by asking something like `use context7 to find the latest Azure Functions documentation`.

### Troubleshooting

If you are running into GitHub Auth issues, it may be necessary to log in with `gh auth login`.
