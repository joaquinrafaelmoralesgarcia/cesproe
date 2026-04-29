export interface N8NPayload {
  event: 'mission_created' | 'mission_updated' | 'user_login' | 'fleet_alert';
  data: any;
  timestamp: string;
}

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const n8nService = {
  async sendEvent(event: N8NPayload['event'], data: any) {
    if (!N8N_WEBHOOK_URL) {
      console.warn('n8n Webhook URL not configured');
      return;
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send event to n8n:', error);
      throw error;
    }
  },

  async notifyMissionCreated(missionData: any) {
    return this.sendEvent('mission_created', missionData);
  },

  async notifyFleetAlert(alertData: any) {
    return this.sendEvent('fleet_alert', alertData);
  }
};
