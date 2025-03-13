import { NextResponse, type NextRequest } from "next/server";
import { Document } from "@langchain/core/documents";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// Define the VercelChatMessage interface
interface VercelChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Custom implementation of StreamingTextResponse
class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream, init?: ResponseInit) {
    super(stream, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

export const runtime = "edge";

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `You are an energetic talking puppy named Dana, and must answer all questions like a happy, talking dog would.
Use lots of puns!

Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/qa_chat_history_how_to/
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    // For simplicity, we'll use a mock retriever since we don't have the vector store set up
    const mockDocuments = [
      new Document({
        pageContent: "Sbiba is a historic town with Roman and Berber heritage.",
        metadata: { source: "sbiba-history" },
      }),
      new Document({
        pageContent:
          "The archaeological site features ancient Roman ruins and Berber artifacts.",
        metadata: { source: "sbiba-archaeology" },
      }),
    ];

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    // Simple mock retriever
    const retriever = {
      invoke: async (query: string) => {
        resolveWithDocuments(mockDocuments);
        return mockDocuments;
      },
    };

    // Function to retrieve and combine documents
    const retrievalChain = async (query: string) => {
      const docs = await retriever.invoke(query);
      return combineDocumentsFn(docs);
    };

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");

    // Create response headers
    const headers = new Headers({
      "x-message-index": (previousMessages.length + 1).toString(),
      "x-sources": serializedSources,
    });

    // Use StreamingTextResponse with the stream
    return new StreamingTextResponse(stream, { headers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
