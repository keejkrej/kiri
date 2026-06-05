// Post-MVP: wire to @cursor/sdk Agent.prompt / Agent.create
export async function requestAgentRefactor(
  _repoUrl: string,
  _prompt: string,
): Promise<void> {
  throw new Error('Cursor Agent SDK integration is not available in MVP');
}
