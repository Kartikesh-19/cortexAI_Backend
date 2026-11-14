import { response } from "express"

export const router=async(state)=>{
const llm=await getModel("router")
const prompt=`

You are an agent router.

Available agents:
-chat
-serach
-pdf
-ppt
-vision

Rules:

chat:
General conversation
explanations,
learning,
questions.

search:
Current events
latest information
news,
recent developments,
interent lookup.


coding:
Generate code
debug code,
build projects,
architecture,
API design.
pdf:
Questions about generate PDFs or document context.

vision:
Generate image,
create image

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:${state.prompt}
`
const res=await  llm.invoke(prompt)

return{
    ...state,
    agent:res.content.trim().toLowerCase()

}
}