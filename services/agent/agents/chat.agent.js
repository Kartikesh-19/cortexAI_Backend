// import getModel  from "../config/llmModel.js";
import llm, { getModel }  from "../config/llmModel.js";

const chatagent = async (params) => {
  const llm = await getModel("chat");
  const systemPrompt = "You are cortexai, an intelligent AI assistant.";
  const response = await llm.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);

  return {
    ...state,
    aiReponse: response.content,
  };
};

export default chatagent;
