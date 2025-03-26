import N8nWorkflowManager from './n8nWorkflowManager';
import nhost from './nhost';

class NewsService {
  constructor() {
    this.n8nManager = new N8nWorkflowManager(
      import.meta.env.VITE_N8N_API_URL,
      import.meta.env.VITE_N8N_API_KEY,
      import.meta.env.VITE_N8N_WEBHOOK_URL,
      import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL
    );
  }

  /**
   * Get news for the current user
   */
  async getNewsForUser(preferences = null) {
    try {
      // Get current user
      const user = nhost.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Execute workflow with user ID and preferences
      const result = await this.n8nManager.executeWorkflow({
        userId: user.id,
        action: 'fetch',
        preferences: preferences
      });

      return result;
    } catch (error) {
      console.error('Error getting news:', error);
      throw error;
    }
  }

  /**
   * Save user preferences
   */
  async saveUserPreferences(preferences) {
    try {
      const user = nhost.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save preferences to Nhost
      const { data, error } = await nhost.graphql.request(`
        mutation SaveUserPreferences($userId: uuid!, $topic: String!, $keywords: jsonb, $preferred_sources: jsonb) {
          insert_user_preferences_one(
            object: {
              user_id: $userId, 
              topic: $topic, 
              keywords: $keywords, 
              preferred_sources: $preferred_sources
            },
            on_conflict: {
              constraint: user_preferences_user_id_key,
              update_columns: [topic, keywords, preferred_sources]
            }
          ) {
            id
          }
        }
      `, {
        userId: user.id,
        topic: preferences.topic || 'general',
        keywords: preferences.keywords || [],
        preferred_sources: preferences.preferred_sources || []
      });

      if (error) {
        throw new Error(`Failed to save preferences: ${error.message}`);
      }

      // Get news with new preferences
      return await this.getNewsForUser(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences() {
    try {
      const user = nhost.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await nhost.graphql.request(`
        query GetUserPreferences($userId: uuid!) {
          user_preferences(where: {user_id: {_eq: $userId}}) {
            id
            topic
            keywords
            preferred_sources
          }
        }
      `, {
        userId: user.id
      });

      if (error) {
        throw new Error(`Failed to get preferences: ${error.message}`);
      }

      return data.user_preferences[0] || {
        topic: 'general',
        keywords: [],
        preferred_sources: []
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }
}

export default new NewsService();