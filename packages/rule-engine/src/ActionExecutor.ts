// Simple library to handle the actions to be performed
import { Action } from './models/rule';
import {
  ProductEventData, User, ActorType, Agent, Group,
} from '@freshworks-jaya/marketplace-models';
import { Integrations } from './models/rule-engine';
import ruleConfig from './RuleConfig';
import { PluginPlaceholders } from './models/plugin';
import { Utils } from './Utils';

export class ActionExecutor {
  /**
   * Calls the appropriate method to perform the action.
   */
  public static handleAction(
    integrations: Integrations,
    action: Action,
    productEventData: ProductEventData
  ): Promise<object> {
    const actionFunc = ruleConfig.actions && ruleConfig.actions[action.type];

    if (actionFunc) {
      return actionFunc(integrations, productEventData, action.value);
    }

    throw new Error('Invalid action type');
  }

  /**
   * 
   * Sets up placeholders for productEventData
   */
  public static setupPlaceholders(productEventData: ProductEventData): void {
    const user = productEventData.associations.user || ({} as User);
    const agent = productEventData.associations.agent ||
      (productEventData.actor.type === ActorType.Agent
        ? productEventData.actor
        : {} as Agent);
    const channel = productEventData.associations.channel;
    const group = productEventData.associations.group || ({} as Group);
    const conversation = productEventData.conversation || productEventData.message;

    // Register static placeholders
    const placeholders = {
      'agent.email': agent.email || '',
      'agent.first_name': agent.first_name || '',
      'agent.id': agent.id || '',
      'agent.last_name': agent.last_name || '',
      'channel.id': channel.id || '',
      'channel.name': channel.name || '',
      'conversation.app_id': conversation.app_id || '',
      'conversation.assigned_agent_id': conversation.assigned_group_id || '',
      'conversation.assigned_group_id': conversation.assigned_group_id || '',
      'conversation.id': conversation.conversation_id || '',
      'conversation.status': conversation.status || '',
      'group.id': group.id || '',
      'group.description': group.description || '',
      'group.name': group.name || '',
      'user.email': user.email || '',
      'user.first_name': user.first_name || '',
      'user.id': user.id || '',
      'user.last_name': user.last_name || '',
      'user.phone': user.phone || '',
    };

    if (Utils.isUsernameGenerated(user.first_name || '')) {
      placeholders['user.first_name'] = '';
    }

    ruleConfig.registerPlugins([{
      placeholders: placeholders
    }]);

    // Register dynamic placeholders
    const dynamicPlaceholders: PluginPlaceholders = {};
    user.properties && user.properties.forEach(userProperty => {
      const placeholderKey: string = `user.properties.${userProperty.name}`;
      dynamicPlaceholders[placeholderKey] = userProperty.value;
    });
    ruleConfig.registerPlugins([{
      placeholders: dynamicPlaceholders
    }]);
  }

  /**
   * Iterates through all the actions and performs each one as configured.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static async handleActions(
    integrations: Integrations,
    actions: Action[],
    productEventData: ProductEventData
  ) {
    this.setupPlaceholders(productEventData);

    for (let i = 0; actions && i < actions.length; i += 1) {
      try {
        const action = actions[i];
        await this.handleAction(
          integrations,
          action,
          productEventData
        );
      } catch (err) {
        throw new Error('Error processing action');
      }
    }
  }
}
