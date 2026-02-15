import type { Patient, Message } from '../types';

interface A2ARequest {
    method: string;
    id: number;
    params: any;
    jsonrpc: string;
}

export const callBackendAgent = async (query: string, patient: Patient): Promise<Message> => {
    // 1. Prepare PAtient Context
    // We strip out large objects like 'rawText' from PDF reports to save bandwidth if possible,
    // but for now, we send the full object.
    const contextJson = JSON.stringify(patient);
    const contextBase64 = btoa(unescape(encodeURIComponent(contextJson))); // Handle UTF-8

    // 2. Prepare A2A RPC Request using the correct protocol
    // Ref: Google A2A protocol. Typically POST to /a2a/app with a message.
    // However, fast_api_app.py uses ADK, which exposes specific endpoints.
    // We will use the 'generate' method usually, or a simple text interaction.
    // Given the ADK setup, we might need to send a message to the "task" or "session".
    // For simplicity, we assume the server handles a POST with a prompt if we use a simplified endpoint,
    // BUT fast_api_app.py is strictly A2A.
    // We will attempt to use the standard "model" chat format if possible, or reverse engineer the A2A endpoint.
    // If we assume standard ADK over HTTP, it might be:

    const rpcPayload = {
        method: "process", // or "agent.process" - depends on ADK version
        params: {
            text: query
        },
        id: Date.now(),
        jsonrpc: "2.0"
    };

    // Note: The A2A_RPC_PATH is /a2a/app.
    // Adk usually expects: POST /a2a/app

    try {
        const response = await fetch('/a2a/app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Patient-Context': contextBase64
            },
            body: JSON.stringify(rpcPayload)
        });

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }

        // A2A response parsing
        // This is complex because A2A streams. 
        // For this migration, if we cannot easily parse A2A stream on client without library,
        // we might hit a wall.
        // fallback: We will assume the Text response is what we get.

        // RE-EVALUATION:
        // Implementing a full A2A client from scratch here is risky.
        // Use the existing client if possible.
        // If not, maybe we should have exposed a simple /chat endpoint in fast_api_app.py for the frontend to consume?
        // YES. That is much safer for a "migration" than reverse-engineering the binary/stream A2A protocol.

        // Step back: I will modify fast_api_app.py to expose a simple /chat REST endpoint that wraps the agent.
        // This makes the frontend integration trivial.

        return {
            id: Date.now(),
            sender: 'ai',
            type: 'text',
            text: "Error: A2A Client not fully implemented. Please use /chat endpoint."
        };

    } catch (e) {
        console.error("Backend Call Failed", e);
        return {
            id: Date.now(),
            sender: 'ai',
            type: 'text',
            text: "Sorry, I am unable to connect to the medical brain at this moment."
        };
    }
};

// Re-implementing correctly below assuming /chat endpoint exists
export const sendMessageToBackend = async (query: string, patient: Patient): Promise<Message> => {
    const contextJson = JSON.stringify(patient);
    const contextBase64 = btoa(unescape(encodeURIComponent(contextJson)));

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Patient-Context': contextBase64
            },
            body: JSON.stringify({ prompt: query })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        // data.text keys the response

        // Try to parse as JSON for Rich UI
        try {
            const potentialJson = JSON.parse(data.text);
            if (typeof potentialJson === 'object' && potentialJson !== null) {
                // If it looks like a message object, return it (add id/sender)
                return {
                    id: Date.now(),
                    sender: 'ai',
                    ...potentialJson
                } as Message;
            }
        } catch (e) {
            // Not JSON, return as text
        }

        return {
            id: Date.now(),
            sender: 'ai',
            type: 'text',
            text: data.text || "No response received."
        };
    } catch (e) {
        console.error(e);
        return {
            id: Date.now(),
            sender: 'ai',
            type: 'text',
            text: "Error communicating with backend agent."
        }
    }
}
