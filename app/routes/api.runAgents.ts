import { type ActionFunctionArgs } from '@remix-run/cloudflare';

// Define proper types for the agent configurations
interface AgentConfig {
  id: string;
  config: Record<string, unknown>;
}

interface AgentResult {
  id: string;
  success: boolean;
  error?: string;
}

// Define the function to run a single agent
async function runAgent(id: string, config: Record<string, unknown>, retries = 3): Promise<void> {
  // Ensure executeAgent is defined and available
  if (typeof executeAgent !== 'function') {
    throw new Error('executeAgent function is not defined');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const agentExecution = await executeAgent(id, config) as AgentResult | undefined;
      // Check if the agent execution was successful
      if (!agentExecution || typeof agentExecution.success !== 'boolean') {
        throw new Error('Invalid agent execution response');
      }
      
      if (!agentExecution.success) {
        throw new Error(agentExecution.error || 'Unknown error occurred during agent execution');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      return; // Exit the function if successful
    } catch (error) {
      if (attempt === retries) {
        throw error; // Rethrow the error if all retries fail
      }
      console.warn(`Retrying agent ${id} (attempt ${attempt}):`, error);
    }
  }
}

// Validate the agent data structure
function validateAgentData(data: unknown): data is Array<AgentConfig> {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof item.id === 'string' &&
    'config' in item &&
    typeof item.config === 'object' &&
    item.config !== null
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();

    // Validate that agentData exists in the parsed body
    if (typeof body !== 'object' || body === null || !('agentData' in body)) {
      return new Response('agentData is required', { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { agentData } = body;

    // Validate the agent data structure
    if (!validateAgentData(agentData)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid agent data structure' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Run each agent with proper error handling
    const results = await Promise.allSettled(
      agentData.map(async (agent): Promise<AgentResult> => {
        try {
          await runAgent(agent.id, agent.config);
          return { id: agent.id, success: true };
        } catch (error) {
          console.error(`Error running agent ${agent.id}:`, error);
          return {
            id: agent.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Process the results
    const successfulAgents = results.filter(
      (result): result is PromiseFulfilledResult<AgentResult> => 
        result.status === 'fulfilled' && result.value.success
    ).map(result => result.value.id);

    const failedAgents = results.filter(
      (result): result is PromiseFulfilledResult<AgentResult> => 
        result.status === 'fulfilled' && !result.value.success
    ).map(result => result.value);

    // Return a detailed response
    return new Response(JSON.stringify({
      status: failedAgents.length === 0 ? 'success' : 'partial_success',
      successful: successfulAgents,
      failed: failedAgents,
      total: results.length
    }), {
      status: failedAgents.length === 0 ? 200 : 207,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Define the executeAgent function with proper type safety
async function executeAgent(id: string, config: Record<string, unknown>): Promise<AgentResult> {
  // Simulate agent execution logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, success: true });
    }, 1000);
  });
}