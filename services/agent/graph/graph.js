import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import chatagent from "../agents/chat.agent.js";
import searchagent from "../agents/search.agent.js";
import codingagent from "../agents/coding.agent.js";
import pdfagent from "../agents/pdf.agent.js";
import pptagent from "../agents/ppt.agent.js";
import imageGenagent from "../agents/vision.agent.js";

const workFlow = new StateGraph(agentState);

workFlow.addNode("router", router);
workFlow.addNode("chat", chatagent);
workFlow.addNode("search", searchagent);
workFlow.addNode("coding", codingagent);
workFlow.addNode("pdf", pdfagent);
workFlow.addNode("ppt", pptagent);
workFlow.addNode("vision", imageGenagent);

workFlow.addEdge("__start__", "router");
workFlow.addConditionalEdges("router", (state) => {
  switch (state.agent) {
    case "router":
      return "router";
    case "chat":
      return "chat";
    case "search":
      return "search";
    case "coding":
      return "coding";
    case "pdf":
      return "pdf";
    case "ppt":
      return "ppt";
    case "vision":
      return "vision";
    default:
      "chat";
      return "chat";
 } },{

      chat:"chat",
      serach:"search",
      coding:"coding",
      pdf:"pdf",
      ppt:"ppt",
      vision:"vision"
  }
);

workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("search","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("vision","__end__")
export const graph =workFlow.compile()
